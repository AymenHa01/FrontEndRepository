import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { EvenemtsService } from '../../Serives/evenemts.service';
import { AuthService } from '../services/auth.service';
import { AdherentService } from '../services/adherent.service';

@Component({
  selector: 'app-evenemnt',
  templateUrl: './evenemnt.component.html',
  styleUrls: ['./evenemnt.component.css']
})
export class EvenemntComponent implements OnInit {
  evenements: any[] = [];
  filteredEvenements: any[] = [];
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 1;
  loading: boolean = false ;
  participationSuccess: boolean= false ;
  participationError: string = "";
  showSuccessAlert: boolean = false ;

  constructor(
    private evenementService: EvenemtsService,
    private router: Router , 
    private authService: AuthService,
    private adherentService: AdherentService
  ) {}

  ngOnInit(): void {
    this.loadEvenements();
  }

  loadEvenements(): void {
    this.evenementService.getAllEvents().subscribe(
      (data: any) => {
        this.evenements = data;
        this.filterEvenements();
      },
      (error) => {
        console.error('Error loading evenements:', error);
      }
    );
  }

  filterEvenements(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEvenements = this.evenements;
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredEvenements = this.evenements.filter(evenement =>
        evenement.name.toLowerCase().includes(searchTermLower) ||
        evenement.Description.toLowerCase().includes(searchTermLower)
      );
    }
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEvenements.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getPagedEvenements(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEvenements.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  viewEventDetails(event: any): void {
console.log(event);

    const navigationExtras: NavigationExtras = {
      state: { event }
    };
    
    this.router.navigate(['/evenement'] 
         , {
            state : {data  : event}
        }



    );
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

 

  




}
