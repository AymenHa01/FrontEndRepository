import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AtelierServiceService } from '../../Serives/atelier-service.service';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-atelier',
  templateUrl: './atelier.component.html',
  styleUrls: ['./atelier.component.css']
})
export class AtelierComponent implements OnInit {
  atelierListe: any[] = [];
  filteredAteliers: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'All';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;

  constructor(
    private router: Router,
    private Atelier: AtelierServiceService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.getAtelier();
    this.test();
  }

  test() {
    this.webSocketService.getAtelier().subscribe({
      next: (data: any) => {
        console.log('Received Atelier Data:', data);
        this.getAtelier();
        this.atelierListe = data;
        this.filterAteliers();
      },
      error: (err) => console.error('WebSocket Error:', err),
      complete: () => console.log('WebSocket Completed')
    });
  }

  getAtelier() {
    this.Atelier.GetAllAtelier().subscribe((data: any) => {
      console.log(data);
      this.atelierListe = data;
      this.filterAteliers();
    });
  }

  navigateToParticipation(id: number) {
    this.router.navigate(['/sousAtelier', id]);
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.currentPage = 1; // Reset to first page when searching
    this.filterAteliers();
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1; // Reset to first page when changing category
    this.filterAteliers();
  }

  private filterAteliers() {
    const filtered = this.atelierListe.filter(atelier => {
      const matchesSearch = atelier.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          atelier.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'All' || 
                            atelier.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.filteredAteliers = filtered;
  }

  // Pagination methods
  onPageChange(page: number) {
    this.currentPage = page;
  }

  getPages(): number[] {
    const pageCount = Math.min(5, this.totalPages); // Show max 5 page numbers
    const halfWay = Math.ceil(pageCount / 2);
    const isStart = this.currentPage <= halfWay;
    const isEnd = this.currentPage > this.totalPages - halfWay;
    const pages: number[] = [];

    if (isStart) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else if (isEnd) {
      for (let i = this.totalPages - pageCount + 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = this.currentPage - halfWay + 1; i <= this.currentPage + halfWay - 1; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
