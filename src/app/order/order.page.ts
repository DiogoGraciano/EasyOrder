import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Order } from './models/order.type';
import { OrderService } from './services/order.service';
import { EnterpriseService } from '../enterprise/services/enterprise.service';
import { Enterprise } from '../enterprise/models/enterprise.type';
import { CustomerService } from '../customer/services/customer.service';
import { Customer } from '../customer/models/customer.type';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  standalone: false,
})
export class OrderPage implements OnInit, ViewWillEnter {
  orderList: Order[] = [];
  enterprises: Enterprise[] = [];
  customers: Customer[] = [];

  ionViewWillEnter(): void {
    this.orderService.getList().subscribe(orders => {
      this.orderList = orders;
    });
    
    this.enterpriseService.getList().subscribe(enterprises => {
      this.enterprises = enterprises;
    });

    this.customerService.getList().subscribe(customers => {
      this.customers = customers;
    });
  }

  constructor(
    private orderService: OrderService,
    private alertController: AlertController,
    private enterpriseService: EnterpriseService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {}

  getEnterpriseName(companyId: number): string {
    const enterprise = this.enterprises.find(e => e.id?.toString() === companyId?.toString());
    return enterprise ? enterprise.tradeName : 'Empresa não encontrada';
  }

  getCustomerName(customerId: number): string {
    const customer = this.customers.find(c => c.id?.toString() === customerId?.toString());
    return customer ? customer.name : 'Cliente não encontrado';
  }

  getStatusLabel(status: string): string {
    const statusMap: {[key: string]: string} = {
      'pending': 'Pendente',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  remove(order: Order) {
    this.alertController
      .create({
        header: 'Exclusão',
        message: `Confirma a exclusão do pedido ${order.orderNumber}?`,
        buttons: [
          {
            text: 'Sim',
            handler: () => {
              this.orderService.remove(order).subscribe();
              setTimeout(() => {
                this.orderService.getList().subscribe(orders => {
                  this.orderList = orders;
                });
              }, 500);
            },
          },
          'Não',
        ],
      })
      .then((alert) => alert.present());
  }
} 