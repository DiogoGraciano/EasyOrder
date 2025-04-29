import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { businessOutline, homeOutline, peopleOutline, cubeOutline, cartOutline } from 'ionicons/icons';

addIcons({
  'business-outline-sharp': businessOutline,
  'people-outline-sharp': peopleOutline,
  'cube-outline-sharp': cubeOutline,
  'cart-outline-sharp': cartOutline,
  'home-outline-sharp': homeOutline
});

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
