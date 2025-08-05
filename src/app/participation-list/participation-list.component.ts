import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdherentService } from '../services/adherent.service';
import { forkJoin } from 'rxjs';

interface Formation {
  debut: string;
  description: string;
  fin: string;
  formateur: string;
  heures: number;
  id: number;
  image: string;
  media: any[];
  name: string;
  prix: number;
}

interface SousAtelier {
  id: number;
  name: string;
  description: string;
  prix: number;
  image: string;
  atelierName: string;
  atelierDescription: string;
}

@Component({
  selector: 'app-participation-list',
  templateUrl: './participation-list.component.html',
  styleUrls: ['./participation-list.component.css']
})
export class ParticipationListComponent implements OnInit {
  atelierParticipations: SousAtelier[] = [];
  formationParticipations: Formation[] = [];
  eventParticipations: any[] = [];
  loading = true;
  error = '';
  
  // Search and filter properties
  searchTerm: string = '';
  selectedFilter: string = 'all';
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private adherentService: AdherentService
  ) { }

  ngOnInit(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadParticipations();
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser')?.length! > 0;
  }

  // Filter options
  filterOptions = [
    { value: 'all', label: 'Tout' },
    { value: 'formations', label: 'Formations' },
    { value: 'ateliers', label: 'Ateliers' },
    { value: 'events', label: 'Événements' }
  ];

  // Search function
  search(items: any[]): any[] {
    if (!this.searchTerm) return items;
    
    const searchLower = this.searchTerm.toLowerCase();
    return items.filter(item => 
      item.name?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  }

  // Get filtered items
  get filteredItems() {
    let items : any = [];
    
    switch (this.selectedFilter) {
      case 'formations':
        items = this.search(this.formationParticipations);
        break;
      case 'ateliers':
        items = this.search(this.atelierParticipations);
        break;
      case 'events':
        items = this.search(this.eventParticipations);
        break;
      default:
        items = this.search([
          ...this.formationParticipations,
          ...this.atelierParticipations,
          ...this.eventParticipations
        ]);
    }
    
    return items;
  }

  // Load all participations
  loadParticipations() {
    const userId = this.authService.currentUserValue?.id;
    const token = this.authService.currentUserValue?.access_token;

    if (!userId || !token) {
      this.error = 'Erreur: Impossible de récupérer les informations utilisateur';
      this.loading = false;
      return;
    }

    this.adherentService.getallParticipation(userId, token).subscribe({
      next: (data: any) => {
        console.log(data);
        
        // Handle sous ateliers
        this.atelierParticipations = data.sousAteliers.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          prix: item.prix,
          image: item.atelier.image || 'assets/image.png',
          atelierName: item.atelier.name,
          atelierDescription: item.atelier.description
        }));

        // Handle formations
        this.formationParticipations = data.formations;

        // Handle evenements
        this.eventParticipations = data.evenements;

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading participations:', error);
        this.error = 'Une erreur est survenue lors du chargement de vos participations';
        this.loading = false;
      }
    });
  }
}
