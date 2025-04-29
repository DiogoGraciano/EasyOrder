import { inject, Injectable } from '@angular/core';
import { Enterprise } from '../models/enterprise.type';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  private http = inject(HttpClient);

  constructor() { }

  getById(id: number): Observable<Enterprise> {
    return this.http.get<Enterprise>(environment.apiUrl+"enterprises/"+id);
  }

  getList(): Observable<Enterprise[]> {
    return this.http.get<Enterprise[]>(environment.apiUrl+"enterprises");
  }

  private add(enterprise: Enterprise): Observable<Enterprise> {
    delete enterprise.id;
    enterprise.cnpj = enterprise.cnpj.replace(/[^0-9]/g,'');
    return this.http.post<Enterprise>(environment.apiUrl+"enterprises", enterprise);
  }

  private update(enterprise: Enterprise): Observable<Enterprise> {
    return this.http.put<Enterprise>(environment.apiUrl+"enterprises/"+enterprise.id, enterprise);
  }

  save(enterprise: Enterprise): Observable<Enterprise> {
    return enterprise.id ? this.update(enterprise) : this.add(enterprise);
  }

  remove(enterprise: Enterprise): Observable<Enterprise> {
    return this.http.delete<Enterprise>(environment.apiUrl+"enterprises/"+enterprise.id);
  }
}
