import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService, Order } from '../../services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  // list of orders for the table
  orders: Order[] = [];

  // form model bound to the template [(ngModel)]
  form: {
    _id?: string;
    customerName: string;
    customerEmail: string;
    item: string;
    quantity: number | null;
    pickupDate: string; // yyyy-mm-dd
    notes: string;
  } = {
    customerName: '',
    customerEmail: '',
    item: '',
    quantity: null,
    pickupDate: '',
    notes: '',
  };

  loading = false;
  errorMessage = '';

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Load existing orders from your Express API
  loadOrders(): void {
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load orders.';
      },
    });
  }

  // Called when the form is submitted
  submitOrder(): void {
    this.errorMessage = '';
    this.loading = true;

    const payload: Order = {
      customerName: this.form.customerName,
      customerEmail: this.form.customerEmail,
      item: this.form.item,
      quantity: Number(this.form.quantity ?? 0),
      pickupDate: this.form.pickupDate,
      notes: this.form.notes,
    };

    // UPDATE existing order
    if (this.form._id) {
      this.ordersService.updateOrder(this.form._id, payload).subscribe({
        next: () => {
          this.loading = false;
          this.resetForm();
          this.loadOrders();
          alert(' Order updated!');
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.errorMessage = 'Failed to update order.';
        },
      });
    }
    // CREATE new order
    else {
      this.ordersService.createOrder(payload).subscribe({
        next: () => {
          this.loading = false;
          this.resetForm();
          this.loadOrders();
          alert('Order saved!');
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.errorMessage = 'Failed to save order.';
        },
      });
    }
  }

  // Fill the form when clicking "Edit"
  editOrder(order: Order): void {
    this.form = {
      _id: order._id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      item: order.item,
      quantity: order.quantity,
      pickupDate: order.pickupDate?.toString().split('T')[0] ?? '',
      notes: order.notes ?? '',
    };

    // scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Delete an order by id
  deleteOrder(id: string): void {
    if (!confirm('Are you sure you want to delete this order?')) return;

    this.ordersService.deleteOrder(id).subscribe({
      next: () => {
        this.loadOrders();
        alert('Order deleted!');
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to delete order.';
      },
    });
  }

  // Clear the form
  resetForm(): void {
    this.form = {
      customerName: '',
      customerEmail: '',
      item: '',
      quantity: null,
      pickupDate: '',
      notes: '',
    };
  }
}
