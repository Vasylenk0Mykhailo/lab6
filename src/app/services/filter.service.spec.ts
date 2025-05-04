import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { ProductService } from './product.service';
import { of } from 'rxjs';

describe('FilterService', () => {
  let service: FilterService;
  let mockProductService: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    mockProductService = jasmine.createSpyObj('ProductService', ['products$']);
    mockProductService.products$ = of([
      { id: 'prod-1', name: 'Product 1', categoryId: 'cat_1', price: 100, description: '', imageUrl: '' },
      { id: 'prod-2', name: 'Product 2', categoryId: 'cat_2', price: 200, description: '', imageUrl: '' },
    ]);

    TestBed.configureTestingModule({
      providers: [
        FilterService,
        { provide: ProductService, useValue: mockProductService },
      ],
    });
    service = TestBed.inject(FilterService);
  });

  it('should filter products by selected categories', (done) => {
    service.setCategories(['cat_1']);
    service.getFilteredProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].id).toBe('prod-1');
      done();
    });
  });

  it('should return an empty array if no categories are selected', (done) => {
    service.setCategories([]);
    service.getFilteredProducts().subscribe((products) => {
      expect(products.length).toBe(0);
      done();
    });
  });

  it('should add a category to the selected list', () => {
    service.addCategory('cat_1');
    service.addCategory('cat_2');
    expect(service['selectedCategoryIds$'].getValue()).toEqual(['cat_1', 'cat_2']);
  });

  it('should remove a category from the selected list', () => {
    service.setCategories(['cat_1', 'cat_2']);
    service.removeCategory('cat_1');
    expect(service['selectedCategoryIds$'].getValue()).toEqual(['cat_2']);
  });
});