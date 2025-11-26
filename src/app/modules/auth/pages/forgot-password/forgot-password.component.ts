import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ValidateInputComponent } from '../../../../shared/components/validate-input/validate-input.component';
import {
  RecoverPasswordFormData,
  recoverPasswordSchema,
} from '../../schemas/auth.schema';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    ValidateInputComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  forgotPasswordForm!: FormGroup;
  loading$ = this.authService.loading$;
  emailSent = false;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: [''],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.forgotPasswordForm.value as RecoverPasswordFormData;

    // Validar com Zod
    const validation = recoverPasswordSchema.safeParse(formData);

    if (!validation.success) {
      this.handleValidationErrors(validation.error.errors);
      return;
    }

    this.authService.recoverPassword(validation.data).subscribe({
      next: () => {
        this.emailSent = true;
      },
      error: (error) => {
        console.error('Erro na recuperação de senha:', error);
      },
    });
  }

  resendEmail(): void {
    this.emailSent = false;
    this.onSubmit();
  }

  backToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach((key) => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  private handleValidationErrors(errors: any[]): void {
    errors.forEach((error) => {
      const field = error.path[0];
      const control = this.forgotPasswordForm.get(field);
      if (control) {
        control.setErrors({ zodError: error.message });
        control.markAsTouched();
      }
    });
  }

  getFieldError(fieldName: string): string | null {
    const control = this.forgotPasswordForm.get(fieldName);
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
