import { Injectable } from '@angular/core';
import { Database, ref, onValue, set, update, remove } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsPath = '/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private db: Database) {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    const productsRef = ref(this.db, this.productsPath);
    onValue(
      productsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const products = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          // Перевіряємо, чи змінився список продуктів
          if (JSON.stringify(this.productsSubject.getValue()) !== JSON.stringify(products)) {
            this.productsSubject.next(products);
          }
        } else {
          this.productsSubject.next([]);
        }
      },
      (error) => {
        console.error('Помилка при завантаженні продуктів:', error);
      }
    );
  }

  addProduct(newProduct: Product): Promise<void> {
    const productId = newProduct.id || `prod-${Date.now()}`; 
    const productRef = ref(this.db, `${this.productsPath}/${productId}`);
    return set(productRef, { ...newProduct, id: productId });
  }

  updateProduct(productId: string, updatedProduct: Product): Promise<void> {
    const productRef = ref(this.db, `${this.productsPath}/${productId}`);
    return set(productRef, updatedProduct); 
  }

  deleteProduct(productId: string): Promise<void> {
    const productRef = ref(this.db, `${this.productsPath}/${productId}`);
    return remove(productRef);
  }
}
