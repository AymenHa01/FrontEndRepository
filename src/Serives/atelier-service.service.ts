import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtelierServiceService {
private Path = (window as any)["env"]?.API_ATELIER_URL || `${environment.apiUrl}/Atelier`;
  constructor(private http : HttpClient  ) { }

  GetAllAtelier(){
    return this.http.get(this.Path+"/GetAllAtelier")
  }
  GetSousAtelier(id : string ){
    return this.http.get(this.Path+"/GetSousAtelier/" + id )
  }

}
