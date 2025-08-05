import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SousAtelierService {
  private apiUrl = (window as any)["env"]?.API_SOUS_ATELIER_URL || '/api/sous-atelier';

  constructor(private http: HttpClient) {}

  getAllSousAteliers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getSousAtelierById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createSousAtelier(sousAtelier: any): Observable<any> {
    return this.http.post(this.apiUrl, sousAtelier);
  }

  updateSousAtelier(id: number, sousAtelier: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, sousAtelier);
  }

  deleteSousAtelier(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
