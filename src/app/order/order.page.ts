import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Order } from './models/order.type';
import { OrderService } from './services/order.service';
import { EnterpriseService } from '../enterprise/services/enterprise.service';
import { Enterprise } from '../enterprise/models/enterprise.type';
import { CustomerService } from '../customer/services/customer.service';
import { Customer } from '../customer/models/customer.type';
import { ToastService } from '../core/services/toast.service';

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
    this.orderService.getList().subscribe({
      next: (orders) => {
        this.orderList = orders;
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

    this.customerService.getList().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        this.toastService.handleError(error);
      }
    });
  }

  constructor(
    private orderService: OrderService,
    private alertController: AlertController,
    private enterpriseService: EnterpriseService,
    private customerService: CustomerService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  getEnterpriseName(enterpriseId: string): string {
    const enterprise = this.enterprises.find(e => e.id === enterpriseId);
    return enterprise ? enterprise.tradeName : 'Empresa não encontrada';
  }

  getCustomerName(customerId: string): string {
    const customer = this.customers.find(c => c.id === customerId);
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
              this.orderService.remove(order).subscribe({
                next: () => {
                  this.toastService.showSuccess('Pedido excluído com sucesso!');
                  setTimeout(() => {
                    this.orderService.getList().subscribe({
                      next: (orders) => {
                        this.orderList = orders;
                      },
                      error: (error) => {
                        this.toastService.handleError(error);
                      }
                    });
                  }, 500);
                },
                error: (error) => {
                  this.toastService.handleError(error);
                }
              });
            },
          },
          'Não',
        ],
      })
      .then((alert) => alert.present());
  }
} 