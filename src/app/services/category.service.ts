import { Injectable } from '@angular/core';
import { Database, ref, onValue, set, update, remove } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoriesPath = '/categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private db: Database) {
    this.fetchCategories();
  }

  private fetchCategories(): void {
    const categoriesRef = ref(this.db, this.categoriesPath);
    onValue(
      categoriesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const categories = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          // Перевіряємо, чи змінився список категорій
          if (JSON.stringify(this.categoriesSubject.getValue()) !== JSON.stringify(categories)) {
            this.categoriesSubject.next(categories);
          }
        } else {
          this.categoriesSubject.next([]);
        }
      },
      (error) => {
        console.error('Помилка при завантаженні категорій:', error);
      }
    );
  }

  addCategory(newCategory: Category): Promise<void> {
    const categoryId = newCategory.id || `cat_${Date.now()}`; 
    const categoryRef = ref(this.db, `${this.categoriesPath}/${categoryId}`);
    return set(categoryRef, { ...newCategory, id: categoryId });
  }

  updateCategory(categoryId: string, updatedCategory: Category): Promise<void> {
    const categoryRef = ref(this.db, `${this.categoriesPath}/${categoryId}`);
    return set(categoryRef, updatedCategory); 
  }

  deleteCategory(categoryId: string): Promise<void> {
    const categoryRef = ref(this.db, `${this.categoriesPath}/${categoryId}`);
    return remove(categoryRef);
  }
}
