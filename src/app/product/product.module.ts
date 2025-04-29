import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
import { ProductFormComponent } from './product-form/product-form.component';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule,
    MaskitoDirective,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ProductPage,
    ProductFormComponent
  ]
})
export class ProductPageModule {} 