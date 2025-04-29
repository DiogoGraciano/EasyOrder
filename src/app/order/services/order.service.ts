import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = environment.apiUrl+'orders';

  constructor(private httpClient: HttpClient) { }

  getList(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.url);
  }

  getById(id: string): Observable<Order> {
    return this.httpClient.get<Order>(`${this.url}/${id}`);
  }

  getByCustomer(customerId: number): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.url}?customerId=${customerId}`);
  }

  getByCompany(companyId: number): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.url}?companyId=${companyId}`);
  }

  save(order: Order): Observable<Order> {
    if (order.id) {
      return this.update(order);
    }
    return this.create(order);
  }

  private create(order: Order): Observable<Order> {
    delete order.id;
    return this.httpClient.post<Order>(this.url, order);
  }

  private update(order: Order): Observable<Order> {
    return this.httpClient.put<Order>(`${this.url}/${order.id}`, order);
  }

  remove(order: Order): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${order.id}`);
  }
} 