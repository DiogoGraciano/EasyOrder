import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerPageRoutingModule } from './customer-routing.module';

import { CustomerPage } from './customer.page';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerPageRoutingModule,
    MaskitoDirective,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CustomerPage,
    CustomerFormComponent
  ]
})
export class CustomerPageModule {} 