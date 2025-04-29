import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home-outline'},
    { title: 'Empresas', url: '/enterprise', icon:'business-outline' },
    { title: 'Clientes', url: '/customer', icon:'people-outline' },
    { title: 'Produtos', url: '/product', icon:'cube-outline' },
    { title: 'Pedidos', url: '/order', icon:'cart-outline' }
  ];

  constructor() { }
}
