import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: any;
  isLoggedIn: boolean = false;
  @ViewChild('navbarNav') navbarNav: ElementRef | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  ngOnInit(): void {
    // Add event listener to close the navbar when clicking outside
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.navbarNav && this.navbarNav.nativeElement.classList.contains('show') && 
          !this.navbarNav.nativeElement.contains(e.target) && 
          !(e.target as HTMLElement).closest('.navbar-toggler')) {
        this.renderer.removeClass(this.navbarNav.nativeElement, 'show');
      }
    });
  }
  
  toggleNavbar() {
    if (this.navbarNav) {
      if (this.navbarNav.nativeElement.classList.contains('show')) {
        this.renderer.removeClass(this.navbarNav.nativeElement, 'show');
      } else {
        this.renderer.addClass(this.navbarNav.nativeElement, 'show');
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
