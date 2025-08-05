import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AtelierServiceService } from '../../Serives/atelier-service.service';
import { AuthService } from '../services/auth.service';
import { AdherentService } from '../services/adherent.service';

@Component({
  selector: 'app-sous-atelier',
  templateUrl: './sous-atelier.component.html',
  styleUrls: ['./sous-atelier.component.css']
})
export class SousAtelierComponent implements OnInit {
  SousAtelierList: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 1;
  sousAteliers: any[] = [];
  loading = false;
  participationSuccess = false;
  participationError = '';
  showSuccessAlert = false;

  constructor(
    private route: ActivatedRoute,
    private SousAtelier: AtelierServiceService,
    private router: Router,
    private authService: AuthService,
    private adherentService: AdherentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.SousAtelier.GetSousAtelier(id).subscribe((data: any) => {
        this.SousAtelierList = data;
        this.calculateTotalPages();
      });
    }
  }

  FilterSousAtelier(MaxPrix: any) {
    this.SousAtelierList = this.SousAtelierList.filter((data: any) => data.prix < MaxPrix)
    console.log(this.SousAtelierList);
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.SousAtelierList.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get paginatedAteliers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.SousAtelierList.slice(startIndex, endIndex);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser')?.length! > 0;
  }

  showAlert() {
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000); // Hide after 3 seconds
  }

  participate(sousAtelierId: number) {
    console.log( localStorage.getItem('currentUser') );
    if (!this.isLoggedIn()) {
      this.router.navigate(['/signup']);
      return;
    }

    this.loading = true;
    this.participationSuccess = false;
    this.participationError = '';

    const userId = this.authService.currentUserValue?.id;
    const token = this.authService.currentUserValue?.access_token;
    if (!userId) {
      this.participationError = 'Erreur: Impossible de récupérer l\'ID de l\'utilisateur';
      this.loading = false;
      return;
    }

    const adherent = {
      type: 'SOUS_ATELIER',
      idType: sousAtelierId
    };

    this.adherentService.addAdherent(userId, adherent ,token ).subscribe({
      next: () => {
        this.loading = false;
        this.showAlert();
        alert('Participation réussie! Vous êtes maintenant inscrit à cet atelier.');
      },
      error: (error) => {
        this.loading = false;
        this.participationError = 'Erreur lors de la participation. Veuillez réessayer.';
        console.error('Participation error:', error);
      }
    });
  }
}
