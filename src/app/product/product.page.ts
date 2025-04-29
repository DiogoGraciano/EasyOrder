import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Product } from './models/product.type';
import { ProductService } from './services/product.service';
import { EnterpriseService } from '../enterprise/services/enterprise.service';
import { Enterprise } from '../enterprise/models/enterprise.type';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: false,
})
export class ProductPage implements OnInit, ViewWillEnter {
  productList: Product[] = [];
  enterprises: Enterprise[] = [];

  ionViewWillEnter(): void {
    this.productService.getList().subscribe(products => {
      this.productList = products;
    });
    
    this.enterpriseService.getList().subscribe(enterprises => {
      this.enterprises = enterprises;
    });
  }

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private enterpriseService: EnterpriseService
  ) {}

  ngOnInit() {}

  getEnterpriseName(companyId: number): string {
    const enterprise = this.enterprises.find(e => e.id == companyId?.toString());
    return enterprise ? enterprise.tradeName : 'Empresa não encontrada';
  }

  remove(product: Product) {
    this.alertController
      .create({
        header: 'Exclusão',
        message: `Confirma a exclusão do produto ${product.name}?`,
        buttons: [
          {
            text: 'Sim',
            handler: () => {
              this.productService.remove(product).subscribe();
              setTimeout(() => {
                this.productService.getList().subscribe(products => {
                  this.productList = products;
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