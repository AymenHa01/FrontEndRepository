import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    username: '',
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    numero: '',
    age: 0,
    image: '',
    statut: true,
    role: 'USER'
  };
  error: string = '';
  loading: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.image = e.target.result.split(',')[1]; // Remove data:image/... prefix
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.error = '';
    this.loading = true;

    // Basic validation
    if ( !this.user.nom || !this.user.prenom || 
        !this.user.email || !this.user.password || !this.user.confirmPassword || 
        !this.user.numero || !this.user.age) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      this.loading = false;
      return;
    }

    // Password validation
    if (this.user.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      this.loading = false;
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      this.loading = false;
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.error = 'Veuillez entrer une adresse email valide';
      this.loading = false;
      return;
    }

    // Phone number validation
    // const phoneRegex = /^[0-9+\s-]{8,}$/;
    // if (!phoneRegex.test(this.user.numero)) {
    //   this.error = 'Veuillez entrer un numéro de téléphone valide';
    //   this.loading = false;
    //   return;
    // }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userToRegister } = this.user;

    // First register the user
    this.authService.register(userToRegister).subscribe({
      next: (response) => {
        // After successful registration, try to login
        this.authService.login(this.user.email, this.user.password).subscribe({
          next: (loginResponse) => {
            this.loading = false;
            this.router.navigate(['/']);
          },
          error: (loginError) => {
            this.loading = false;
            this.error = 'Inscription réussie mais erreur lors de la connexion automatique. Veuillez vous connecter manuellement.';
            this.router.navigate(['/login']);
          }
        });
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 409) {
          this.error = 'Ce nom d\'utilisateur ou email existe déjà';
        } else {
          this.error = 'Une erreur est survenue lors de l\'inscription';
          console.error('Registration error:', error);
        }
      }
    });
  }
}
