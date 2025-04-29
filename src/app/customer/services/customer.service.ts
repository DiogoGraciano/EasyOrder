import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private url = environment.apiUrl+'customers';

  constructor(private httpClient: HttpClient) { }

  getList(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.url);
  }

  getById(id: string): Observable<Customer> {
    return this.httpClient.get<Customer>(`${this.url}/${id}`);
  }

  save(customer: Customer): Observable<Customer> {
    if (customer.id) {
      return this.update(customer);
    }
    return this.create(customer);
  }

  private create(customer: Customer): Observable<Customer> {
    delete customer.id;
    return this.httpClient.post<Customer>(this.url, customer);
  }

  private update(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(`${this.url}/${customer.id}`, customer);
  }

  remove(customer: Customer): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${customer.id}`);
  }
} 