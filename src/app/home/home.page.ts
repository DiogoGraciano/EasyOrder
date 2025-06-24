import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order/services/order.service';
import { CustomerService } from '../customer/services/customer.service';
import { ProductService } from '../product/services/product.service';
import { EnterpriseService } from '../enterprise/services/enterprise.service';
import { Order } from '../order/models/order.type';
import { Customer } from '../customer/models/customer.type';
import { Product } from '../product/models/product.type';
import { Enterprise } from '../enterprise/models/enterprise.type';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  enterprises: Enterprise[] = [];
  
  // Dashboard metrics
  totalOrders = 0;
  totalCustomers = 0;
  totalProducts = 0;
  totalSales = 0;
  pendingOrders = 0;
  
  // Chart data
  orderStatusData = {
    labels: ['Pendente', 'Completo', 'Cancelado'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#ffce56', '#36a2eb', '#ff6384']
    }]
  };

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private enterpriseService: EnterpriseService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ionViewWillEnter() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    forkJoin({
      orders: this.orderService.getList(),
      customers: this.customerService.getList(),
      products: this.productService.getList(),
      enterprises: this.enterpriseService.getList()
    }).subscribe(results => {
      this.orders = results.orders;
      this.customers = results.customers;
      this.products = results.products;
      this.enterprises = results.enterprises;
      
      this.calculateMetrics();
    });
  }

  calculateMetrics() {
    // Basic counts
    this.totalOrders = this.orders.length;
    this.totalCustomers = this.customers.length;
    this.totalProducts = this.products.length;
    
    // Total sales amount
    this.totalSales = this.orders.reduce((sum, order) => sum + (typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount), 0);
    
    // Count by status
    const pendingCount = this.orders.filter(order => order.status === 'pending').length;
    const completedCount = this.orders.filter(order => order.status === 'completed').length;
    const cancelledCount = this.orders.filter(order => order.status === 'cancelled').length;
    
    this.pendingOrders = pendingCount;
    
    // Update chart data
    this.orderStatusData.datasets[0].data = [pendingCount, completedCount, cancelledCount];
  }
}
