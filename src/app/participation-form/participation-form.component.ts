import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-participation-form',
  templateUrl: './participation-form.component.html',
  styleUrls: ['./participation-form.component.css'] // Remarquez ici le changement de 'styleUrl' à 'styleUrls'
})
export class ParticipationFormComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private location: Location) {
    this.registrationForm = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Validation pour 8 chiffres
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form Submitted', this.registrationForm.value);
      // Ajoutez ici la logique pour traiter les données du formulaire, comme l'envoi à un serveur
    }
  }

  goBack() {
    this.location.back(); 
  }
}
