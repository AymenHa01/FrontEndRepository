import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
import { AdherentService } from '../services/adherent.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {
  selectedEvent: any;
  EventsList: any[] = [];
  event: any;
  data: any;
  loading: boolean = false ;
  participationSuccess: boolean= false ;
  participationError: string = '' ;
  showSuccessAlert:  boolean = false ;

  constructor(
    private router: Router, private route: ActivatedRoute ,     private authService: AuthService,
    private adherentService: AdherentService
  ) {}

  ngOnInit() {
    this.data = history.state?.data
    console.log(this.data);
    this.loadEventDetails()
  }

  loadEventDetails() {
  
    this.selectedEvent = {
      id: this.data.id,
      title: this.data.name,
      date:this.data.dateDebut,
      location: 'Galerie d\'Art de Tunis',
      mainImage: '../../assets/image.png',
      images: [
        '../../assets/image.png',
        '../../assets/image.png',
        '../../assets/image.png',
        '../../assets/image.png',
        '../../assets/image.png',
        '../../assets/image.png',
        '../../assets/image.png',
        '../../assets/image.png',
        '../../assets/image.png',
        '../../assets/image.png'
      ],
      description: this.data.description,
      participants: this.data.prix,
      duration: this.calculateDateDifference(this.data.dateDebut, this.data.dateFin) + "jours" ,
      category: 'Exposition d\'Art'
    };
  }

  joinEvent(eventId: number) {
    // Implement your join event logic here
    console.log('Joining event:', eventId);
  }

  shareEvent(eventId: number) {
    // Implement your share event logic here
    console.log('Sharing event:', eventId);
  }

  navigateWithObject(id: number) {
    this.router.navigate(['/events', id]);
  }

  calculateDateDifference(dateDebut: string, dateFin: string): number {
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);
  
    const timeDifference = endDate.getTime() - startDate.getTime();
  
    const dayDifference = timeDifference / (1000 * 3600 * 24);
  
    return Math.round(dayDifference);
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

  participate(EvenementId: number) {
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
      type: 'EVENEMENT',
      idType: EvenementId
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
