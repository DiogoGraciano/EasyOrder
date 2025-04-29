import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Enterprise } from './models/enterprise.type';
import { EnterpriseService } from './services/enterprise.service';

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.page.html',
  styleUrls: ['./enterprise.page.scss'],
  standalone: false,
})
export class EnterprisePage implements OnInit, ViewWillEnter {
  enterpriseList: Enterprise[] = [];

  ionViewWillEnter(): void {
    this.enterpriseService.getList().subscribe(enterprises => {
      this.enterpriseList = enterprises;
    });
  }

  constructor(
    private enterpriseService: EnterpriseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  remove(enterprise: Enterprise) {
    this.alertController
      .create({
        header: 'Exclusão',
        message: `Confirma a exclusão do jogo ${enterprise.tradeName}?`,
        buttons: [
          {
            text: 'Sim',
            handler: () => {
              this.enterpriseService.remove(enterprise).subscribe();
              setTimeout(() => {
                this.enterpriseService.getList().subscribe(enterprises => {
                  this.enterpriseList = enterprises;
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
