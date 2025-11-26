import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ValidateInputComponent } from '../../../../shared/components/validate-input/validate-input.component';
import { LoginFormData, loginSchema } from '../../schemas/auth.schema';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ProgressSpinnerModule,
    ValidateInputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  loading$ = this.authService.loading$;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.loginForm.value as LoginFormData;

    // Validar com Zod
    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      this.handleValidationErrors(validation.error.errors);
      return;
    }

    this.authService.login(validation.data).subscribe({
      next: () => {
        // Redirecionamento é feito pelo serviço
      },
      error: (error) => {
        console.error('Erro no login:', error);
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private handleValidationErrors(errors: any[]): void {
    errors.forEach((error) => {
      const field = error.path[0];
      const control = this.loginForm.get(field);
      if (control) {
        control.setErrors({ zodError: error.message });
        control.markAsTouched();
      }
    });
  }

  getFieldError(fieldName: string): string | null {
    const control = this.loginForm.get(fieldName);
    if (control?.touched && control?.errors) {
      if (control.errors['zodError']) {
        return control.errors['zodError'];
      }
      if (control.errors['required']) {
        return `${fieldName} é obrigatório`;
      }
      if (control.errors['email']) {
        return 'Email inválido';
      }
    }
    return null;
  }

  hasFieldError(fieldName: string): boolean {
    return this.getFieldError(fieldName) !== null;
  }
}
