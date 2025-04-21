import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './services/category.service';
import { Category } from './interfaces/category.interface';
import { ProductService } from './services/product.service';
import { Product } from './interfaces/product.interface';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const mockCategories: Category[] = [
    { id: '1', name: 'Настільні ігри' },
    { id: '2', name: '3D-друк' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch categories', () => {
    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(req => req.method === 'GET');
    expect(req.request.headers.has('X-Master-Key')).toBeTrue();
    req.flush({ record: mockCategories });
  });

  it('should add category and send PUT request', () => {
    const newCategory: Category = { id: '3', name: 'Моделювання' };
    const updatedCategories = [...mockCategories, newCategory];

    service.addCategory(newCategory, mockCategories).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(req => req.method === 'PUT');
    expect(req.request.body).toEqual(updatedCategories);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({ success: true });
  });
});

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    { id: 'p1', name: 'PLA пластик', description: 'Пластик для 3D друку', price: 500, imageUrl: 'url', categoryId: '2' },
    { id: 'p2', name: 'Настільна гра', description: 'Цікава гра', price: 700, imageUrl: 'url2', categoryId: '1' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch products', () => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(req => req.method === 'GET');
    expect(req.request.headers.has('X-Master-Key')).toBeTrue();
    req.flush({ record: mockProducts });
  });
});