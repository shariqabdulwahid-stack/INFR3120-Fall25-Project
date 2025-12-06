import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirm = '';
  errors: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (this.password !== this.confirm) {
      this.errors = ['Passwords do not match'];
      return;
    }

    this.authService
      .register(this.name, this.email, this.password, this.confirm)
      .subscribe({
        next: () => {
          alert('Registered successfully!');
          this.router.navigate(['/login']); // redirect after success
        },
        error: (err) => {
          this.errors = [err.error?.error || 'Registration failed'];
        }
      });
  }
}
