import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = environment.apiUrl+'products';

  constructor(private httpClient: HttpClient) { }

  getList(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.url);
  }

  getById(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.url}/${id}`);
  }

  getByCompany(enterpriseId: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.url}?enterpriseId=${enterpriseId}`);
  }

  save(product: Product): Observable<Product> {
    if (product.id) {
      return this.update(product);
    }
    return this.create(product);
  }

  private create(product: Product): Observable<Product> {
    delete product.id;
    return this.httpClient.post<Product>(this.url, product);
  }

  private update(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.url}/${product.id}`, product);
  }

  remove(product: Product): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${product.id}`);
  }
} 