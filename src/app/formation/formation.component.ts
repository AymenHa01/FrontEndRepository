import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FormationService } from '../../Serives/formation.service';
import { WebSocketService } from '../services/websocket.service';

interface Formation {
  id: number;
  name: string;
  description: string;
  prix: number;
  image: string;
  level: string;
}

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent implements OnInit {
  formations: Formation[] = [];
  filteredFormations: any[] = [];
  searchTerm: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedCategory: string = 'All';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;

  constructor(
    private webSocketService: WebSocketService , 
    private formationService: FormationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFormations();

    this.WebSocket()


  }


  WebSocket(){
    this.webSocketService.getFormation().subscribe(
      (data: any) => {
        console.log(data);
        
        this.formations = data;
        this.filterFormations();
      },
      (error) => {
        console.error('Error loading formations:', error);
      }
    )
  }

  loadFormations(): void {
    this.formationService.getFormations().subscribe(
      (data: any) => {
        console.log(data);
        
        this.formations = data;
        this.filterFormations();
      },
      (error) => {
        console.error('Error loading formations:', error);
      }
    );
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
    this.filterFormations();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.filterFormations();
  }

  filterFormations(): void {
    this.filteredFormations = this.formations.filter(formation => {
      const matchesSearch = this.searchTerm ? 
        formation.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        formation.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesCategory = this.selectedCategory === 'All' || 
                            formation.level === this.selectedCategory;

      const matchesMinPrice = this.minPrice ? formation.prix >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice ? formation.prix <= this.maxPrice : true;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    this.totalPages = Math.ceil(this.filteredFormations.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
  }

  getPagedFormations(): Formation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredFormations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Pagination methods
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
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

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  

  navigateToParticipation(): void {
    this.router.navigate(['/participation']);
  }

  viewFormationDetails(formation: any): void {
 
    const navigationExtras: NavigationExtras = {
      state: { event }
    };
    
    this.router.navigate(['/FormationDetails'] 
         , {
            state : {data  : formation}
        }



    );
  }
}
