import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../models/customer.type';
import { CustomerService } from '../services/customer.service';
import { ApplicationValidators } from 'src/app/core/validators/url.validator';
import { cpfMask, maskitoElement, phoneMask } from 'src/app/core/constants/mask.constants';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  standalone: false
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  customer!: Customer;
  isEditMode = false;
  
  cpfMask = cpfMask;
  phoneMask = phoneMask;
  maskitoElement = maskitoElement;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.customerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required, Validators.minLength(3), Validators.maxLength(150)
      ]),
      email: new FormControl('', [
        Validators.required, Validators.email
      ]),
      phone: new FormControl('', [
        Validators.required, ApplicationValidators.phoneValidator
      ]),
      photo: new FormControl(null, [
        ApplicationValidators.urlValidator
      ]),
      cpf: new FormControl('', [
        Validators.required,
        ApplicationValidators.cpfValidator
      ]),
      address: new FormControl('', [
        Validators.required, Validators.minLength(3), Validators.maxLength(250)
      ]),
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.customerService.getById(id).subscribe(customer => {
        this.customer = customer;
        this.customerForm.patchValue(customer);
      });
    }
  }

  hasError(field: string, error: string) {
    const formControl = this.customerForm.get(field);
    return formControl?.touched && formControl?.errors?.[error];
  }

  isFieldInvalid(field: string) {
    const formControl = this.customerForm.get(field);
    return formControl?.invalid && formControl?.touched;
  }

  submitForm() {
    const formValue = this.customerForm.value
    const customer: Customer = {
      ...formValue,
      id: this.activatedRoute.snapshot.params['id']
    };
    this.customerService.save(customer).subscribe(() => {
      this.router.navigate(['/customer']);
    });
  }
} 