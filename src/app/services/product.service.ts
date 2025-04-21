import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly url = 'https://api.jsonbin.io/v3/b/67f599328a456b796685289c/latest';
  private readonly headers = {
    'X-Master-Key': '$2a$10$/r.Tn2o.SDXCgieHySLwMuKDIbyznQ8GgZtqUPvtqoryWq2EWYBVq',
  };

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<{ record: Product[] }>(this.url, { headers: this.headers }).pipe(
      map(res => res.record)
    );
  }
}
