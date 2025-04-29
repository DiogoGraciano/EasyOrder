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
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      orderNumber: [{ value: this.generateOrderNumber(), disabled: true }],
      orderDate: [new Date().toISOString(), [Validators.required]],
      status: ['pending', [Validators.required]],
      customerId: ['', [Validators.required]],
      companyId: ['', [Validators.required]],
      totalAmount: [{ value: 0, disabled: true }],
      notes: [''],
      items: this.formBuilder.array([])
    });

    this.customerService.getList().subscribe(customers => {
      this.customers = customers;
    });

    this.enterpriseService.getList().subscribe(enterprises => {
      this.enterprises = enterprises;
    });

    this.productService.getList().subscribe(products => {
      this.products = products;
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.orderService.getById(id).subscribe(order => {
        this.order = order;
        
        this.orderForm.patchValue({
          orderNumber: order.orderNumber,
          orderDate: order.orderDate,
          status: order.status,
          customerId: order.customerId,
          companyId: order.companyId,
          notes: order.notes,
          totalAmount: order.totalAmount
        });

        // Adicionar os itens existentes ao formulário
        order.items.forEach(item => {
          this.addItem(item);
          // Carregar informações do produto
          this.productService.getById(item.productId.toString()).subscribe(product => {
            this.selectedProducts[item.productId.toString()] = product;
          });
        });
      });
    }

    // Atualizar valor total quando os itens mudarem
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
        const product = this.products.find(p => p.id == productId);
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
    const quantity = itemForm.get('quantity')?.value || 0;
    const unitPrice = itemForm.get('unitPrice')?.value || 0;
    const subtotal = quantity * unitPrice;
    
    itemForm.patchValue({
      subtotal: subtotal
    });
    
    this.updateTotalAmount();
  }

  updateTotalAmount(): void {
    let total = 0;
    for (const item of this.items.controls) {
      total += (item as FormGroup).get('subtotal')?.value || 0;
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
    
    // Preparar os itens com os valores corretos
    const orderItems: OrderItem[] = formValue.items.map((item: any) => {
      const productId = item.productId.toString();
      return {
        productId: item.productId,
        productName: this.selectedProducts[productId].name,
        quantity: item.quantity,
        unitPrice: this.selectedProducts[productId].price,
        subtotal: item.quantity * this.selectedProducts[productId].price
      };
    });

    const order: Order = {
      ...formValue,
      items: orderItems,
      // Se estiver editando, manter o ID
      ...(this.isEditMode && { id: this.order.id })
    };

    this.orderService.save(order).subscribe({
      next: () => this.router.navigate(['/order']),
      error: (error) => console.error('Erro ao salvar pedido', error)
    });
  }
} 