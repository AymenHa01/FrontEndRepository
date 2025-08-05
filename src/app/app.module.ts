import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GaleryComponent } from './galery/galery.component';
import { FormationComponent } from './formation/formation.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ParticipationFormComponent } from './participation-form/participation-form.component';
import { FooterComponent } from './footer/footer.component';
import { EvenemntComponent } from './evenemnt/evenemnt.component';
import { AtelierComponent } from './atelier/atelier.component';
import { ArtistComponent } from './artist/artist.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SousAtelierComponent } from './sous-atelier/sous-atelier.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { WebsocketDemoComponent } from './components/websocket-demo/websocket-demo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ParticipationListComponent } from './participation-list/participation-list.component';
import { FormationDetailsComponent } from './formation-details/formation-details.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ActualitesComponent } from './actualites/actualites.component';
import { ActualiterComponent } from './actualiter/actualiter.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    GaleryComponent,
    FormationComponent,
    HomeComponent,
    NavbarComponent,
    ParticipationFormComponent,
    FooterComponent,
    EvenemntComponent,
    ArtistComponent,
    AtelierComponent,
    SousAtelierComponent,
    AllEventsComponent,
    WebsocketDemoComponent,
    ParticipationListComponent,
    FormationDetailsComponent,
    ChatbotComponent,
    ActualitesComponent,
    ActualiterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
