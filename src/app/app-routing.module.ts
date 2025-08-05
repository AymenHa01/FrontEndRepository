import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GaleryComponent } from './galery/galery.component';
import { HomeComponent } from './home/home.component';
import { AtelierComponent } from './atelier/atelier.component';
import { FormationComponent } from './formation/formation.component';
import { EvenemntComponent } from './evenemnt/evenemnt.component';
import { ParticipationFormComponent } from './participation-form/participation-form.component';
import { ArtistComponent } from './artist/artist.component';
import { SousAtelierComponent } from './sous-atelier/sous-atelier.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { WebsocketDemoComponent } from './components/websocket-demo/websocket-demo.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ParticipationListComponent } from './participation-list/participation-list.component';
import { FormationDetailsComponent } from './formation-details/formation-details.component';
import { ActualitesComponent } from './actualites/actualites.component';
import { ActualiterComponent } from './actualiter/actualiter.component';
const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: 'accueil', component: HomeComponent },
  { path: 'actualites', component: ActualitesComponent },
  { path: 'listParticipation', component: ParticipationListComponent },
  { path: 'actualiter', component: ActualiterComponent },
  { path: 'artist' , component: ArtistComponent},
  { path: 'FormationDetails' , component: FormationDetailsComponent},
  { path: 'galerie/:id', component: GaleryComponent },
  { path: 'atelier', component: AtelierComponent },
  { path: 'sousAtelier/:id', component: SousAtelierComponent },
  { path: 'formation', component: FormationComponent},
  { path: 'participer', component:  ParticipationFormComponent},
  { path: 'allevenement', component: EvenemntComponent},
  { path: 'evenement', component: AllEventsComponent},
  { path: 'chat', component: WebsocketDemoComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: 'accueil' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
