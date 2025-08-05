import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SArtistService } from '../../Serives/serviceArtist/s-artist.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
  formations: any[] = [];
  filteredArtists: any[] = [];
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 1;

  constructor(private router: Router, private Artiste: SArtistService) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists() {
    this.Artiste.getArtiste().subscribe((data: any) => {
      this.formations = data;
      this.filterArtists();
    });
  }

  filterArtists() {
    if (!this.searchTerm.trim()) {
      this.filteredArtists = this.formations;
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredArtists = this.formations.filter(artist =>
        artist.title.toLowerCase().includes(searchTermLower) ||
        artist.description.toLowerCase().includes(searchTermLower)
      );
    }
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredArtists.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  navigateToParticipation(id: number) {
    this.router.navigate(['/galerie', id]);
  }
}
