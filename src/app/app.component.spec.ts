import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { FilterService } from './services/filter.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Product } from './interfaces/product.interface';
import { Category } from './interfaces/category.interface';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockProductService: any;
  let mockCategoryService: any;
  let mockFilterService: any;

  const mockProducts: Product[] = [
    { id: '1', name: 'Товар 1', description: 'Опис 1', price: 100, imageUrl: 'url1', categoryId: 'cat1' },
    { id: '2', name: 'Товар 2', description: 'Опис 2', price: 200, imageUrl: 'url2', categoryId: 'cat2' }
  ];

  const mockCategories: Category[] = [
    { id: 'cat1', name: 'Категорія 1' },
    { id: 'cat2', name: 'Категорія 2' }
  ];

  beforeEach(async () => {
    mockProductService = {
      getProducts: jasmine.createSpy('getProducts').and.returnValue(of(mockProducts)),
      updateAllProducts: jasmine.createSpy('updateAllProducts').and.returnValue(of(true))
    };

    mockCategoryService = {
      getCategories: jasmine.createSpy('getCategories').and.returnValue(of(mockCategories)),
      updateAllCategories: jasmine.createSpy('updateAllCategories').and.returnValue(of(true)),
      addCategory: jasmine.createSpy('addCategory').and.returnValue(of(true))
    };

    mockFilterService = {};

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: FilterService, useValue: mockFilterService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('має створитися', () => {
    expect(component).toBeTruthy();
  });

  it('має завантажити продукти і категорії при ініціалізації', () => {
    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(mockCategoryService.getCategories).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.categories.length).toBe(2);
  });

  it('має повертати правильну назву категорії', () => {
    const name = component.getCategoryName('cat1');
    expect(name).toBe('Категорія 1');
  });

  it('має повертати "Невідомо" якщо категорія не знайдена', () => {
    const name = component.getCategoryName('unknown');
    expect(name).toBe('Невідомо');
  });

  it('має додавати категорію до фільтра при toggleCategoryFilter', () => {
    const initialLength = component.selectedCategoryIds.length;
    component.toggleCategoryFilter('cat1');
    expect(component.selectedCategoryIds.length).toBe(initialLength + 1);
    expect(component.selectedCategoryIds).toContain('cat1');
  });

  it('має видаляти категорію з фільтра при повторному toggleCategoryFilter', () => {
    component.selectedCategoryIds = ['cat1'];
    component.toggleCategoryFilter('cat1');
    expect(component.selectedCategoryIds).not.toContain('cat1');
  });

  it('має правильно фільтрувати продукти', () => {
    component.selectedCategoryIds = ['cat1'];
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].categoryId).toBe('cat1');
  });

  it('має правильно фільтрувати категорії', () => {
    component.selectedCategoryIds = ['cat2'];
    component.filterCategories();
    expect(component.filteredCategories.length).toBe(1);
    expect(component.filteredCategories[0].id).toBe('cat2');
  });

  it('має додавати нову категорію', () => {
    component.categoryForm.setValue({ id: 'cat3', name: 'Категорія 3' });
    component.addCategory();
    expect(mockCategoryService.addCategory).toHaveBeenCalled();
  });

  it('має обробляти submit категорії (оновлення)', () => {
    component.categoryToEdit = { id: 'cat1', name: 'Стара назва' };
    component.handleCategoryFormSubmit({ id: 'cat1', name: 'Нова назва' });
    expect(mockCategoryService.updateAllCategories).toHaveBeenCalled();
  });

  it('має обробляти submit категорії (додавання)', () => {
    component.categoryToEdit = undefined;
    const initialCount = component.categories.length;
    component.handleCategoryFormSubmit({ id: 'cat3', name: 'Категорія 3' });
    expect(component.categories.length).toBe(initialCount + 1);
  });

  it('має видаляти категорію', () => {
    component.selectedCategoryIds = ['cat1'];
    const initialCount = component.categories.length;
    component.deleteCategory('cat1');
    expect(component.categories.length).toBe(initialCount - 1);
    expect(component.selectedCategoryIds).not.toContain('cat1');
  });

  it('має відкривати форму редагування продукту', () => {
    component.toggleProductForm(mockProducts[0]);
    expect(component.productFormVisible).toBeTrue();
    expect(component.productToEdit).toEqual(mockProducts[0]);
  });

  it('має обробляти submit продукту (оновлення)', () => {
    component.productToEdit = { ...mockProducts[0] };
    component.handleProductFormSubmit({ ...mockProducts[0], name: 'Новий товар' });
    expect(mockProductService.updateAllProducts).toHaveBeenCalled();
  });

  it('має обробляти submit продукту (додавання)', () => {
    component.productToEdit = undefined;
    const initialCount = component.products.length;
    component.handleProductFormSubmit({ id: '3', name: 'Товар 3', description: '', price: 300, imageUrl: '', categoryId: 'cat1' });
    expect(component.products.length).toBe(initialCount + 1);
  });

  it('має видаляти продукт', () => {
    const initialCount = component.products.length;
    component.deleteProduct('1');
    expect(mockProductService.updateAllProducts).toHaveBeenCalled();
  });

});
