import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Order {
  _id?: string;
  customerName: string;
  customerEmail: string;
  item: string;
  quantity: number;
  pickupDate: string;
  notes?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiBase = environment.apiBase;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiBase}/orders/api`, { withCredentials: true });
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiBase}/orders`, order, { withCredentials: true });
  }

  updateOrder(id: string, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiBase}/orders/${id}`, order, { withCredentials: true });
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiBase}/orders/${id}`, { withCredentials: true });
  }
}