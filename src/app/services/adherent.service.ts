import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Adherent {
  id?: number;
  type: string;
  idType: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdherentService {
  private baseUrl = `${environment.apiUrl}/Adhrent`;

  constructor(private http: HttpClient) { }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  addAdherent(userId: number, adherent: Adherent, token: string): Observable<any> {
    console.log(token);
    console.log(userId, adherent);
    return this.http.post(`${this.baseUrl}/add?id=${userId}`, adherent, { headers: this.getHeaders(token) });
  }

  getParticipations(userId: number, type: string, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/participations/${userId}/${type}`, { 
      headers: this.getHeaders(token) 
    });
  }

  // Get Event details
  getEvent(eventId: number, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetEvents/${eventId}`, {
      headers: this.getHeaders(token)
    });
  }

  // Get SousAtelier details
  getallParticipation(atelierId: number, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAlladhrentParticiapation/${atelierId}`, {
      headers: this.getHeaders(token)
    });
  }

  // Get Formation details
  getFormation(formationId: number, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetFormation/${formationId}`, {
      headers: this.getHeaders(token)
    });
  }
}
