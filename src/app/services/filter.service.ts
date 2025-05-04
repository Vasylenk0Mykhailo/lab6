import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private selectedCategoryIds$ = new BehaviorSubject<string[]>([]); 
  private products$ = this.productService.products$; 

  constructor(private productService: ProductService) {}

  setCategories(categoryIds: string[]): void {
    this.selectedCategoryIds$.next(categoryIds);
  }

  addCategory(categoryId: string): void {
    const current = this.selectedCategoryIds$.getValue();
    if (!current.includes(categoryId)) {
      this.selectedCategoryIds$.next([...current, categoryId]);
    }
  }

  removeCategory(categoryId: string): void {
    const current = this.selectedCategoryIds$.getValue();
    this.selectedCategoryIds$.next(current.filter((id) => id !== categoryId));
  }

  getFilteredProducts(): Observable<Product[]> {
    return combineLatest([this.products$, this.selectedCategoryIds$]).pipe(
      map(([products, selectedCategoryIds]) => {
        if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
          return []; 
        }
        return products.filter((product: Product) =>
          selectedCategoryIds.includes(product.categoryId)
        );
      })
    );
  }
}
