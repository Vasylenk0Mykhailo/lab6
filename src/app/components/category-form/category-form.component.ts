import { Component, Output, EventEmitter, OnInit, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../interfaces/category.interface';
import {IonItem, IonLabel, IonInput, IonButton} from "@ionic/angular/standalone";
@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, IonItem, IonLabel, IonInput, IonButton],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  readonly categoryToEdit = input<Category>();
  @Output() formSubmit = new EventEmitter<Category>();

  categoryForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.categoryForm = this.fb.group({
      id: [this.categoryToEdit()?.id || '', Validators.required],
      name: [this.categoryToEdit()?.name || '', [Validators.required, Validators.minLength(3)]],
    });
  }

  submitForm() {
    if (this.categoryForm.valid) {
      this.formSubmit.emit(this.categoryForm.value);
    }
  }
}
