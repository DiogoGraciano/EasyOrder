import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Product } from './models/product.type';
import { ProductService } from './services/product.service';
import { EnterpriseService } from '../enterprise/services/enterprise.service';
import { Enterprise } from '../enterprise/models/enterprise.type';
import { ToastService } from '../core/services/toast.service';

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
    this.productService.getList().subscribe({
      next: (products) => {
        this.productList = products;
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
  }

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private enterpriseService: EnterpriseService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  getEnterpriseName(enterpriseId: string): string {
    const enterprise = this.enterprises.find(e => e.id === enterpriseId);
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
              this.productService.remove(product).subscribe({
                next: () => {
                  this.toastService.showSuccess('Produto excluído com sucesso!');
                  setTimeout(() => {
                    this.productService.getList().subscribe({
                      next: (products) => {
                        this.productList = products;
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