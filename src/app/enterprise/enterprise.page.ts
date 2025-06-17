import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Enterprise } from './models/enterprise.type';
import { EnterpriseService } from './services/enterprise.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.page.html',
  styleUrls: ['./enterprise.page.scss'],
  standalone: false,
})
export class EnterprisePage implements OnInit, ViewWillEnter {
  enterpriseList: Enterprise[] = [];

  ionViewWillEnter(): void {
    this.enterpriseService.getList().subscribe({
      next: (enterprises) => {
        this.enterpriseList = enterprises;
      },
      error: (error) => {
        this.toastService.handleError(error);
      }
    });
  }

  constructor(
    private enterpriseService: EnterpriseService,
    private alertController: AlertController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  remove(enterprise: Enterprise) {
    this.alertController
      .create({
        header: 'Exclusão',
        message: `Confirma a exclusão da empresa ${enterprise.tradeName}?`,
        buttons: [
          {
            text: 'Sim',
            handler: () => {
              this.enterpriseService.remove(enterprise).subscribe({
                next: () => {
                  this.toastService.showSuccess('Empresa excluída com sucesso!');
                  setTimeout(() => {
                    this.enterpriseService.getList().subscribe({
                      next: (enterprises) => {
                        this.enterpriseList = enterprises;
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
