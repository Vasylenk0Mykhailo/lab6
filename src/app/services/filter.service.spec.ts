import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { ProductService } from './product.service';
import { of } from 'rxjs';
import { Product } from '../interfaces/product.interface';

describe('FilterService', () => {
  let service: FilterService;
  let mockProductService: any;

  const mockProducts: Product[] = [
    { id: '1', name: 'Товар 1', description: '', price: 100, imageUrl: '', categoryId: 'cat1' },
    { id: '2', name: 'Товар 2', description: '', price: 200, imageUrl: '', categoryId: 'cat2' },
    { id: '3', name: 'Товар 3', description: '', price: 300, imageUrl: '', categoryId: 'cat1' }
  ];

  beforeEach(() => {
    mockProductService = {
      getProducts: jasmine.createSpy('getProducts').and.returnValue(of(mockProducts))
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    });
    service = TestBed.inject(FilterService);
  });

  it('має створитися', () => {
    expect(service).toBeTruthy();
  });

  it('має оновлювати вибрані категорії через setCategories()', (done) => {
    service.setCategories(['cat1', 'cat2']);
    service.getFilteredProducts().subscribe(filteredProducts => {
      expect(filteredProducts.length).toBe(3); // 2 з cat1 і 1 з cat2
      done();
    });
  });

  it('має додавати категорію через addCategory()', (done) => {
    service.setCategories(['cat1']);
    service.addCategory('cat2');

    service.getFilteredProducts().subscribe(filteredProducts => {
      expect(filteredProducts.length).toBe(3); 
      const categories = filteredProducts.map(p => p.categoryId);
      expect(categories).toContain('cat1');
      expect(categories).toContain('cat2');
      done();
    });
  });

  it('має не додавати категорію повторно через addCategory()', (done) => {
    service.setCategories(['cat1']);
    service.addCategory('cat1'); // вже існує

    service.getFilteredProducts().subscribe(filteredProducts => {
      expect(filteredProducts.length).toBe(2); // тільки продукти з cat1
      done();
    });
  });

  it('має видаляти категорію через removeCategory()', (done) => {
    service.setCategories(['cat1', 'cat2']);
    service.removeCategory('cat1');

    service.getFilteredProducts().subscribe(filteredProducts => {
      expect(filteredProducts.length).toBe(1); 
      expect(filteredProducts[0].categoryId).toBe('cat2');
      done();
    });
  });

  it('має повертати пустий масив, якщо немає вибраних категорій', (done) => {
    service.setCategories([]);
    service.getFilteredProducts().subscribe(filteredProducts => {
      expect(filteredProducts.length).toBe(0);
      done();
    });
  });

});
