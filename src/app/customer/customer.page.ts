import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Customer } from './models/customer.type';
import { CustomerService } from './services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
  standalone: false,
})
export class CustomerPage implements OnInit, ViewWillEnter {
  customerList: Customer[] = [];

  ionViewWillEnter(): void {
    this.customerService.getList().subscribe(customers => {
      this.customerList = customers;
    });
  }

  constructor(
    private customerService: CustomerService,
    private alertController: AlertController
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
              this.customerService.remove(customer).subscribe();
              setTimeout(() => {
                this.customerService.getList().subscribe(customers => {
                  this.customerList = customers;
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