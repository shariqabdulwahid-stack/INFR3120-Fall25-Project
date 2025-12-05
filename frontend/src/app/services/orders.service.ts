import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  _id?: string;
  customerName: string;
  customerEmail: string;
  item: string;
  quantity: number;
  pickupDate: string; // yyyy-mm-dd
  notes?: string;
  status?: string;    
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  // change this to deployed backend URL
  private apiBase = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiBase}/orders/api`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiBase}/orders`, order);
  }

  updateOrder(id: string, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiBase}/orders/${id}`, order);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiBase}/orders/${id}`);
  }
}
