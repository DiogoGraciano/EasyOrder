import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, OrderItem } from '../models/order.type';
import { OrderService } from '../services/order.service';
import { CustomerService } from '../../customer/services/customer.service';
import { EnterpriseService } from '../../enterprise/services/enterprise.service';
import { ProductService } from '../../product/services/product.service';
import { Customer } from '../../customer/models/customer.type';
import { Enterprise } from '../../enterprise/models/enterprise.type';
import { Product } from '../../product/models/product.type';
import { priceMask } from 'src/app/core/constants/mask.constants';
import { maskitoParseNumber } from '@maskito/kit';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  standalone: false
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  order!: Order;
  isEditMode = false;
  priceMask = priceMask;
  customers: Customer[] = [];
  enterprises: Enterprise[] = [];
  products: Product[] = [];
  selectedProducts: {[key: string]: Product} = {};

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private enterpriseService: EnterpriseService,
    private productService: ProductService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      orderNumber: [{ value: this.generateOrderNumber(), disabled: true }],
      orderDate: [new Date().toISOString(), [Validators.required]],
      status: ['pending', [Validators.required]],
      customerId: ['', [Validators.required]],
      enterpriseId: ['', [Validators.required]],
      totalAmount: [{ value: 0, disabled: true }],
      notes: [''],
      items: this.formBuilder.array([])
    });

    this.customerService.getList().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        this.toastService.handleError(error);
      }
    });

    this.enterpriseService.getList().subscribe({
      next: (enterprises) => {
        this.enterprises = enterprises;
      },
      error: (error) => {
        this.toastService.handleError(error);
      }
    });

    this.productService.getList().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        this.toastService.handleError(error);
      }
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.orderService.getById(id).subscribe({
        next: (order) => {
          this.order = order;
          
          this.orderForm.patchValue({
            orderNumber: order.orderNumber,
            orderDate: order.orderDate,
            status: order.status,
            customerId: order.customerId,
            enterpriseId: order.enterpriseId,
            notes: order.notes,
            totalAmount: order.totalAmount
          });

          order.items.forEach(item => {
            this.addItem(item);
            this.productService.getById(item.productId.toString()).subscribe({
              next: (product) => {
                this.selectedProducts[item.productId.toString()] = product;
              },
              error: (error) => {
                this.toastService.handleError(error);
              }
            });
          });
        },
        error: (error) => {
          this.toastService.handleError(error);
        }
      });
    }

    this.items.valueChanges.subscribe(() => {
      this.updateTotalAmount();
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem(item?: OrderItem): void {
    const itemForm = this.formBuilder.group({
      productId: [item?.productId || '', [Validators.required]],
      productName: [{ value: item?.productName || '', disabled: true }],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [{ value: item?.unitPrice || 0, disabled: true }],
      subtotal: [{ value: item?.subtotal || 0, disabled: true }]
    });

    // Atualizar preço unitário quando o produto mudar
    itemForm.get('productId')?.valueChanges.subscribe(productId => {
      if (productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
          this.selectedProducts[productId.toString()] = product;
          itemForm.patchValue({
            productName: product.name,
            unitPrice: product.price
          });
          this.updateItemSubtotal(itemForm);
        }
      }
    });

    // Atualizar subtotal quando a quantidade mudar
    itemForm.get('quantity')?.valueChanges.subscribe(() => {
      this.updateItemSubtotal(itemForm);
    });

    this.items.push(itemForm);
  }

  updateItemSubtotal(itemForm: FormGroup): void {
    const quantity = parseFloat(itemForm.get('quantity')?.value || '0');
    const unitPrice = parseFloat(itemForm.get('unitPrice')?.value || '0');
    const subtotal = parseFloat((quantity * unitPrice).toFixed(2));
    
    itemForm.patchValue({
      subtotal: subtotal
    });
    
    this.updateTotalAmount();
  }

  updateTotalAmount(): void {
    let total = 0;
    for (const item of this.items.controls) {
      total += parseFloat((item as FormGroup).get('subtotal')?.value || '0');
    }
    this.orderForm.patchValue({
      totalAmount: total
    });
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  generateOrderNumber(): string {
    const date = new Date();
    const timestamp = date.getTime();
    return `ORD-${timestamp}`;
  }

  submitForm() {
    if (this.orderForm.invalid) {
      return;
    }

    const formValue = {...this.orderForm.getRawValue()};
    
    const orderItems: OrderItem[] = formValue.items.map((item: any) => {
      const productIdStr = item.productId.toString();
      const selectedProduct = this.selectedProducts[productIdStr];
      const unitPrice = parseFloat(selectedProduct.price.toString());
      const quantity = parseInt(item.quantity.toString());
      return {
        productId: item.productId.toString(),
        productName: selectedProduct.name,
        quantity: quantity,
        unitPrice: unitPrice,
        subtotal: parseFloat((quantity * unitPrice).toFixed(2))
      };
    });

    const order: Order = {
      ...formValue,
      totalAmount: parseFloat(formValue.totalAmount.toString()),
      customerId: formValue.customerId.toString(),
      enterpriseId: formValue.enterpriseId.toString(),
      items: orderItems,
      ...(this.isEditMode && { id: this.order.id })
    };

    this.orderService.save(order).subscribe({
      next: () => {
        this.toastService.showSuccess(this.isEditMode ? 'Pedido atualizado com sucesso!' : 'Pedido criado com sucesso!');
        this.router.navigate(['/order']);
      },
      error: (error) => {
        this.toastService.handleError(error);
      }
    });
  }
} 