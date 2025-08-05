import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Artiste, SArtistService } from '../../Serives/serviceArtist/s-artist.service';

@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.css']
})
export class GaleryComponent implements OnInit {
  @ViewChild('galleryGrid') galleryGrid: any;
  
  searchTerm: string = '';
  loading: boolean = false;
  showBackToTop: boolean = false;
  
  // Gallery state
  currentView: 'artists' | 'tableaux' = 'artists';
  selectedArtist: Artiste | null = null;
  
  // Data
  artists: any[] = [];
  tableaux: any[] = [];
  filteredArtists: any[] = [];
  filteredTableaux: any[] = [];

  constructor(private artistService: SArtistService) { }

  ngOnInit(): void {
    this.loadArtists();
    this.checkScroll();
  }
  loadArtists() {
    this.loading = true;
    this.artistService.getArtiste().subscribe({
      next: (artists) => {
        this.artists = artists;
        this.filteredArtists = artists;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading artists:', error);
        this.loading = false;
      }
    });
  }

  loadTableauxByArtist(artistId: number) {
    this.loading = true;
    this.artistService.getTableauxByArtist(artistId).subscribe({
      next: (tableaux) => {
        this.tableaux = tableaux;
        this.filteredTableaux = tableaux;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tableaux:', error);
        this.loading = false;
      }
    });
  }

  selectArtist(artist: Artiste) {
    this.selectedArtist = artist;
    this.currentView = 'tableaux';
    this.loadTableauxByArtist(artist.id);
  }

  backToArtists() {
    this.currentView = 'artists';
    this.selectedArtist = null;
    this.tableaux = [];
    this.filteredTableaux = [];
  }

  applySearch() {
    if (this.currentView === 'artists') {
      this.filteredArtists = this.artists.filter(artist => {
        const fullName = `${artist.nom} ${artist.prenom}`.toLowerCase();
        return fullName.includes(this.searchTerm.toLowerCase());
      });
    } else {
      this.filteredTableaux = this.tableaux.filter(tableau => {
        return tableau.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
               tableau.description.toLowerCase().includes(this.searchTerm.toLowerCase());        
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.checkScroll();
  }

  checkScroll() {
    this.showBackToTop = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
