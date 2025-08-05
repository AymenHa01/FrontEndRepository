import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Artiste {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numero: string;
  image: string;
}

export interface Tableau {
  id: number;
  titre: string;
  description: string;
  image: string;
  prix: number;
  category: string;
  artiste: Artiste;
}

@Injectable({
  providedIn: 'root'
})
export class SArtistService {
   path:string = `${environment.apiUrl}/Tableaux`;
  constructor(private http:HttpClient) {}

  getArtiste(): Observable<Artiste[]>{
    return this.http.get<Artiste[]>(this.path + `/GetArtiste`);
  }

  getTableauxByArtist(artistId: number): Observable<Tableau[]> {
    return this.http.get<Tableau[]>(this.path + `/GetTableaux/${artistId}`);
  }
}
