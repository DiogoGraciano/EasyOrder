import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Customer } from './models/customer.type';
import { CustomerService } from './services/customer.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
  standalone: false,
})
export class CustomerPage implements OnInit, ViewWillEnter {
  customerList: Customer[] = [];

  ionViewWillEnter(): void {
    this.customerService.getList().subscribe({
      next: (customers) => {
        this.customerList = customers;
      },
      error: (error) => {
        this.toastService.handleError(error);
      }
    });
  }

  constructor(
    private customerService: CustomerService,
    private alertController: AlertController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  remove(customer: Customer) {
    this.alertController
      .create({
        header: 'Exclusão',
        message: `Confirma a exclusão do cliente ${customer.name}?`,
        buttons: [
          {
            text: 'Sim',
            handler: () => {
              this.customerService.remove(customer).subscribe({
                next: () => {
                  this.toastService.showSuccess('Cliente excluído com sucesso!');
                  setTimeout(() => {
                    this.customerService.getList().subscribe({
                      next: (customers) => {
                        this.customerList = customers;
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