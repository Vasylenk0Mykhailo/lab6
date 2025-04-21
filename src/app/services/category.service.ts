import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../interfaces/category.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly url = 'https://api.jsonbin.io/v3/b/67f599198a456b796685288a/latest';
  private readonly headers = {
    'X-Master-Key': '$2a$10$/r.Tn2o.SDXCgieHySLwMuKDIbyznQ8GgZtqUPvtqoryWq2EWYBVq',
  };

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<{ record: Category[] }>(this.url, { headers: this.headers }).pipe(
      map(res => res.record)
    );
  }
  addCategory(newCategory: Category, existingCategories: Category[]): Observable<any> {
    const updatedCategories = [...existingCategories, newCategory];
    const binUrl = 'https://api.jsonbin.io/v3/b/67f599198a456b796685288a'; 
  
    return this.http.put(
      binUrl,
      updatedCategories,
      { headers: { ...this.headers, 'Content-Type': 'application/json' } }
    );
  }
  updateAllCategories(categories: Category[]): Observable<any> {
    const binUrl = 'https://api.jsonbin.io/v3/b/67f599198a456b796685288a';
    return this.http.put(
      binUrl,
      categories,
      { headers: { ...this.headers, 'Content-Type': 'application/json' } }
    );
  }
  
}
