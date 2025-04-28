import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { Product } from './interfaces/product.interface';
import { Category } from './interfaces/category.interface';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonCardTitle, IonCardContent, IonCardSubtitle, IonCard, IonTitle, IonContent, IonCardHeader, IonApp, IonRouterOutlet, IonButton, IonItem, IonLabel, IonInput } from "@ionic/angular/standalone";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from "./components/product-form/product-form.component";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [HttpClientModule, ReactiveFormsModule, IonHeader, IonToolbar, IonCardTitle, IonCardContent, IonCardSubtitle, IonCard, IonTitle, IonContent, IonCardHeader, CommonModule, IonButton, CategoryFormComponent, ProductFormComponent],
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

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
    id: ['', Validators.required],
    name: ['', Validators.required]
  });
  }

  ngOnInit() {
    console.log('AppComponent запущено');
    this.loadCategories();
    this.loadProducts();
  }
  

  loadCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      console.log('Завантажені категорії:', data);
      this.categories = data;
      this.cdr.detectChanges();
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      console.log('Завантажені продукти:', data);
      this.products = data;
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

  addCategory() {
    const newCat = this.categoryForm.value;
    this.categoryService.addCategory(newCat, this.categories).subscribe(() => {
      this.categories.push(newCat);
      this.categoryForm.reset();
      this.categoryFormVisible = false;
      this.cdr.detectChanges();
    });
  }
  deleteCategory(id: string) {
    this.categories = this.categories.filter(cat => cat.id !== id);
    this.categoryService.updateAllCategories(this.categories).subscribe(() => {
      this.cdr.detectChanges();
    });
  }
  handleCategoryFormSubmit(category: Category) {
    if (this.categoryToEdit) {
      this.categories = this.categories.map(c =>
        c.id === this.categoryToEdit?.id ? { ...c, ...category } : c
      );
    } else {
      this.categories.push(category);
    }
  
    this.categoryService.updateAllCategories(this.categories).subscribe(() => {
      this.loadCategories();
      this.categoryFormVisible = false;
      this.categoryToEdit = undefined;
    });
  }
  toggleProductForm(product?: Product): void {
    if (product) {
      this.productToEdit = { ...product }; 
    } else {
      this.productToEdit = undefined; 
    }
    this.productFormVisible = true;
  }
  
  handleProductFormSubmit(product: Product) {
    if (this.productToEdit) {
      this.products = this.products.map(p =>
        p.id === this.productToEdit?.id ? { ...p, ...product } : p
      );
    } else {
      this.products.push(product);
    }
  
    this.productService.updateAllProducts(this.products).subscribe(() => {
      this.loadProducts();
      this.productFormVisible = false;
      this.productToEdit = undefined;
    });
  }
  
  deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    this.productService.updateAllProducts(this.products).subscribe(() => {
      this.loadProducts();
    });
  }
}
