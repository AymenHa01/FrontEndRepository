import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvenemtsService {
  private apiUrl = `${environment.apiUrl}/Evenemet`;

  constructor(private http: HttpClient) {}

  getAllEvents() {

    return this.http.get(`${this.apiUrl}/GetAll`);
    
  }


}
