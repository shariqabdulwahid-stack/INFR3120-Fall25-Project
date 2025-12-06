import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBase = environment.apiBase;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBase}/login`, { email, password }, { withCredentials: true });
  }

  register(name: string, email: string, password: string, confirm: string): Observable<any> {
    return this.http.post(`${this.apiBase}/register`, { name, email, password, confirm }, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiBase}/logout`, {}, { withCredentials: true });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiBase}/users/me`, { withCredentials: true });
  }
}