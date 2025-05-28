import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ValidateInputComponent } from '../../../../shared/components/validate-input/validate-input.component';
import {
  VerificationCodeFormData,
  verificationCodeSchema,
} from '../../schemas/auth.schema';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    ValidateInputComponent,
  ],
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
})
export class VerifyCodeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  verifyCodeForm!: FormGroup;
  loading$ = this.authService.loading$;
  email: string = '';

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.initForm();
  }

  private initForm(): void {
    this.verifyCodeForm = this.fb.group({
      email: [this.email],
      code: [''],
    });
  }

  onSubmit(): void {
    if (this.verifyCodeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.verifyCodeForm.value as VerificationCodeFormData;

    // Validar com Zod
    const validation = verificationCodeSchema.safeParse(formData);

    if (!validation.success) {
      this.handleValidationErrors(validation.error.errors);
      return;
    }

    this.authService.validateCode(validation.data).subscribe({
      next: () => {
        this.router.navigate(['/auth/reset-password'], {
          queryParams: { email: this.email },
        });
      },
      error: (error) => {
        console.error('Erro na validação do código:', error);
      },
    });
  }

  resendCode(): void {
    if (!this.email) return;

    this.authService.sendVerificationCode({ email: this.email }).subscribe({
      next: () => {
        // Toast já é exibido pelo serviço
      },
      error: (error) => {
        console.error('Erro ao reenviar código:', error);
      },
    });
  }

  backToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.verifyCodeForm.controls).forEach((key) => {
      const control = this.verifyCodeForm.get(key);
      control?.markAsTouched();
    });
  }

  private handleValidationErrors(errors: any[]): void {
    errors.forEach((error) => {
      const field = error.path[0];
      const control = this.verifyCodeForm.get(field);
      if (control) {
        control.setErrors({ zodError: error.message });
        control.markAsTouched();
      }
    });
  }

  getFieldError(fieldName: string): string | null {
    const control = this.verifyCodeForm.get(fieldName);
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
