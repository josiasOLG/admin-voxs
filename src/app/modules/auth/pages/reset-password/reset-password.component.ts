import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ValidateInputComponent } from '../../../../shared/components/validate-input/validate-input.component';
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from '../../schemas/auth.schema';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    ValidateInputComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  resetPasswordForm!: FormGroup;
  loading$ = this.authService.loading$;
  email: string = '';

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.initForm();
  }

  private initForm(): void {
    this.resetPasswordForm = this.fb.group({
      email: [this.email],
      password: [''],
      confirmPassword: [''],
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.resetPasswordForm.value as ResetPasswordFormData;

    // Validar com Zod
    const validation = resetPasswordSchema.safeParse(formData);

    if (!validation.success) {
      this.handleValidationErrors(validation.error.errors);
      return;
    }

    // Remove confirmPassword antes de enviar
    const { confirmPassword, ...resetData } = validation.data;

    this.authService.resetPassword(resetData).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Erro ao redefinir senha:', error);
      },
    });
  }

  backToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.resetPasswordForm.controls).forEach((key) => {
      const control = this.resetPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  private handleValidationErrors(errors: any[]): void {
    errors.forEach((error) => {
      const field = error.path[0];
      const control = this.resetPasswordForm.get(field);
      if (control) {
        control.setErrors({ zodError: error.message });
        control.markAsTouched();
      }
    });
  }

  getFieldError(fieldName: string): string | null {
    const control = this.resetPasswordForm.get(fieldName);
    if (control?.touched && control?.errors) {
      if (control.errors['zodError']) {
        return control.errors['zodError'];
      }
      if (control.errors['required']) {
        return `${fieldName} é obrigatório`;
      }
    }
    return null;
  }

  hasFieldError(fieldName: string): boolean {
    return this.getFieldError(fieldName) !== null;
  }
}
