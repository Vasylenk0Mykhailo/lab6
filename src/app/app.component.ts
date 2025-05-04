import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { Product } from './interfaces/product.interface';
import { Category } from './interfaces/category.interface';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonCardTitle, IonCardContent, IonCardSubtitle, IonCard, IonTitle, IonContent, IonCardHeader, IonButton, IonItem, IonLabel, IonCheckbox, IonList } from "@ionic/angular/standalone";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from "./components/product-form/product-form.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [IonCheckbox, ReactiveFormsModule, IonHeader, IonToolbar, IonCardTitle, IonCardContent, IonCardSubtitle, IonCard, IonTitle, IonContent, IonCardHeader, CommonModule, IonButton, CategoryFormComponent, ProductFormComponent, IonList, IonItem, IonLabel],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productFormVisible = false;
  categoryFormVisible = false;
  productToEdit: Product | undefined = undefined;
  categoryForm: FormGroup;
  categoryToEdit: Category | undefined = undefined;
  filteredProducts: Product[] = [];
  filteredCategories: Category[] = [];
  selectedCategoryIds: string[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log('AppComponent запущено');

    this.productService.products$.subscribe((data) => {
      console.log('Оновлені продукти:', data);
      this.products = data;
      this.filterProducts();
      this.cdr.detectChanges();
    });

    this.categoryService.categories$.subscribe((data) => {
      console.log('Оновлені категорії:', data);
      this.categories = data;
      if (this.categories.length > 0) {
        this.selectedCategoryIds = [this.categories[0].id];
      }
      this.filterProducts();
      this.cdr.detectChanges();
    });
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find(cat => cat.id === categoryId)?.name || 'Невідомо';
  }

  toggleCategoryForm(category?: Category) {
    this.categoryFormVisible = !this.categoryFormVisible;
    this.categoryToEdit = category || undefined;
  }

  handleCategoryFormSubmit(category: Category) {
    if (this.categoryToEdit) {
      this.categoryService.updateCategory(this.categoryToEdit.id, category).then(() => {
        this.categoryFormVisible = false;
        this.categoryToEdit = undefined;

        // Оновлення списку категорій відбувається через потік categories$
        this.filterProducts();
      });
    } else {
      this.categoryService.addCategory(category).then(() => {
        this.categoryFormVisible = false;

        // Оновлення списку категорій відбувається через потік categories$
        this.filterProducts();
      });
    }
  }

  deleteCategory(id: string) {
    const productsToDelete = this.products.filter(product => product.categoryId === id);
    const deleteProductPromises = productsToDelete.map(product =>
      this.productService.deleteProduct(product.id)
    );

    Promise.all(deleteProductPromises)
      .then(() => {
        return this.categoryService.deleteCategory(id);
      })
      .then(() => {
        console.log(`Категорія ${id} та всі пов'язані продукти успішно видалені.`);
        this.selectedCategoryIds = this.selectedCategoryIds.filter(cid => cid !== id);
        this.filterProducts();
        this.filterCategories();
      })
      .catch((error) => {
        console.error('Помилка при видаленні категорії або пов’язаних продуктів:', error);
      });
  }

  toggleProductForm(product?: Product): void {
    this.productToEdit = product ? { ...product } : undefined;
    this.productFormVisible = true;
  }

  handleProductFormSubmit(product: Product) {
    if (this.productToEdit) {
      this.productService.updateProduct(this.productToEdit.id, product).then(() => {
        this.productFormVisible = false;
        this.productToEdit = undefined;

        // Оновлення списку продуктів відбувається через потік products$
        this.filterProducts();
      });
    } else {
      this.productService.addProduct(product).then(() => {
        this.productFormVisible = false;

        // Оновлення списку продуктів відбувається через потік products$
        this.filterProducts();
      });
    }
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id).then(() => {
      this.filteredProducts = this.filteredProducts.filter(product => product.id !== id);
    }).catch((error) => {
      console.error('Помилка при видаленні продукту:', error);
    });
  }

  toggleCategoryFilter(categoryId: string) {
    const index = this.selectedCategoryIds.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategoryIds.splice(index, 1);
    } else {
      this.selectedCategoryIds.push(categoryId);
    }
    this.filterProducts();
    this.filterCategories();
  }

  filterProducts() {
    if (!this.selectedCategoryIds || this.selectedCategoryIds.length === 0) {
      this.filteredProducts = []; // Якщо категорії не вибрані, нічого не відображаємо
    } else {
      this.filteredProducts = this.products.filter((product) =>
        this.selectedCategoryIds.includes(product.categoryId)
      );
    }
  }

  filterCategories() {
    if (!this.selectedCategoryIds || this.selectedCategoryIds.length === 0) {
      this.filteredCategories = []; // Якщо категорії не вибрані, нічого не відображаємо
    } else {
      this.filteredCategories = this.categories.filter(category =>
        this.selectedCategoryIds.includes(category.id)
      );
    }
  }
}
