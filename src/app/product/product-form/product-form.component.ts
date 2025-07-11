import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product.type';
import { ProductService } from '../services/product.service';
import { ApplicationValidators } from 'src/app/core/validators/url.validator';
import { EnterpriseService } from 'src/app/enterprise/services/enterprise.service';
import { Enterprise } from 'src/app/enterprise/models/enterprise.type';
import { priceMask, maskitoElement } from 'src/app/core/constants/mask.constants';
import { ToastService } from 'src/app/core/services/toast.service'; 

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: false
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  product!: Product;
  isEditMode = false;
  enterprises: Enterprise[] = [];
  priceMask = priceMask;
  maskitoElement = maskitoElement;

  constructor(
    private productService: ProductService,
    private enterpriseService: EnterpriseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.productForm = new FormGroup({
      name: new FormControl('', [
        Validators.required, Validators.minLength(3), Validators.maxLength(150)
      ]),
      description: new FormControl('', [
        Validators.required, Validators.minLength(3), Validators.maxLength(500)
      ]),
      price: new FormControl('', [
        Validators.required, Validators.min(0)
      ]),
      stock: new FormControl('', [
        Validators.required, Validators.min(0)
      ]),
      photo: new FormControl(null, [
        ApplicationValidators.urlValidator
      ]),
      enterpriseId: new FormControl('', [
        Validators.required
      ]),
    });

    // Fetch list of enterprises
    this.enterpriseService.getList().subscribe({
      next: (enterprises) => {
        this.enterprises = enterprises;
      },
      error: (error) => {
        this.toastService.handleError(error);
      }
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productService.getById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.productForm.patchValue(product);
        },
        error: (error) => {
          this.toastService.handleError(error);
        }
      });
    }
  }

  hasError(field: string, error: string) {
    const formControl = this.productForm.get(field);
    return formControl?.touched && formControl?.errors?.[error];
  }

  isFieldInvalid(field: string) {
    const formControl = this.productForm.get(field);
    return formControl?.invalid && formControl?.touched;
  }

  submitForm() {
    const formValue = this.productForm.value;
    const price = formValue.price ? 
      parseFloat(formValue.price.toString().replace(/\./g, '').replace(',', '.')) : 
      0;
    
    const product: Product = {
      ...formValue,
      price: price,
      stock: parseInt(formValue.stock.toString()) || 0,
      enterpriseId: formValue.enterpriseId.toString(),
      id: this.activatedRoute.snapshot.params['id']
    };
    this.productService.save(product).subscribe({
      next: () => {
        this.toastService.showSuccess(this.isEditMode ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
        this.router.navigate(['/product']);
      },
      error: (error) => {
        this.toastService.handleError(error);
      }
    });
  }
} 