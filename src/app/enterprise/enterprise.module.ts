import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnterprisePageRoutingModule } from './enterprise-routing.module';

import { EnterprisePage } from './enterprise.page';
import { EnterpriseFormComponent } from './enterprise-form/enterprise-form.component';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnterprisePageRoutingModule,
    MaskitoDirective,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    EnterprisePage,
    EnterpriseFormComponent
  ]
})
export class EnterprisePageModule {}
