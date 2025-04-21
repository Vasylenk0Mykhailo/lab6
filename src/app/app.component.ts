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
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports:[HttpClientModule,ReactiveFormsModule, IonHeader, IonToolbar, IonCardTitle,IonCardContent, IonCardSubtitle, IonCard, IonTitle, IonContent, IonCardHeader, CommonModule, IonButton, IonItem, IonLabel, IonInput ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  categoryFormVisible = false;
  categoryForm: FormGroup;

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
  toggleCategoryForm() {
    this.categoryFormVisible = !this.categoryFormVisible;
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
}
