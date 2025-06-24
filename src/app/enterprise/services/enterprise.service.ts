import { inject, Injectable } from '@angular/core';
import { Enterprise } from '../models/enterprise.type';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { formatDateMaskToISO } from 'src/app/core/constants/mask.constants';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  private http = inject(HttpClient);

  constructor() { }

  getById(id: string): Observable<Enterprise> {
    return this.http.get<Enterprise>(environment.apiUrl + "enterprises/" + id);
  }

  getList(): Observable<Enterprise[]> {
    return this.http.get<Enterprise[]>(environment.apiUrl + "enterprises");
  }

  private add(enterprise: Enterprise, logoFile?: File | null): Observable<Enterprise> {
    delete enterprise.id;
    enterprise.cnpj = enterprise.cnpj.replace(/[^0-9]/g, '');

    enterprise.foundationDate = formatDateMaskToISO(enterprise.foundationDate as Date);

    const formData = new FormData();
    Object.keys(enterprise).forEach(key => {
      const value = enterprise[key as keyof Enterprise];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (logoFile) {
      formData.append('logo', logoFile, logoFile.name);
    }

    return this.http.post<Enterprise>(environment.apiUrl + "enterprises", formData);
  }

  private update(enterprise: Enterprise, logoFile?: File | null): Observable<Enterprise> {

    const formData = new FormData();

    enterprise.cnpj = enterprise.cnpj.replace(/[^0-9]/g, '');

    enterprise.foundationDate = formatDateMaskToISO(enterprise.foundationDate as Date);

    Object.keys(enterprise).forEach(key => {
      const value = enterprise[key as keyof Enterprise];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (logoFile) {
      formData.append('logo', logoFile, logoFile.name);
    }

    return this.http.put<Enterprise>(environment.apiUrl + "enterprises/" + enterprise.id, formData);

  }

  save(enterprise: Enterprise, logoFile?: File | null): Observable<Enterprise> {
    return enterprise.id ? this.update(enterprise, logoFile) : this.add(enterprise, logoFile);
  }

  remove(enterprise: Enterprise): Observable<Enterprise> {
    return this.http.delete<Enterprise>(environment.apiUrl + "enterprises/" + enterprise.id);
  }
}
