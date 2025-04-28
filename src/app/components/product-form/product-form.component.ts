import { Component, Output, EventEmitter, OnInit, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product.interface';
import { IonItem, IonLabel, IonInput, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, IonItem, IonLabel, IonInput, IonButton],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  readonly productToEdit = input<Product | undefined>();
  @Output() formSubmit = new EventEmitter<Product>();

  productForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [this.productToEdit()?.id || '', Validators.required],
      name: [this.productToEdit()?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.productToEdit()?.description || '', [Validators.required, Validators.minLength(5)]],
      price: [this.productToEdit()?.price || '', [Validators.required, Validators.min(0)]],
      imageUrl: [this.productToEdit()?.imageUrl || '', [Validators.required, Validators.pattern(/^https?:\/\//)]],
      categoryId: [this.productToEdit()?.categoryId || '', Validators.required],
    });
  }

  submitForm() {
    if (this.productForm.valid) {
      this.formSubmit.emit(this.productForm.value);
    }
  }
}
