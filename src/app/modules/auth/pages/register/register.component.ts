import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ValidateInputComponent } from '../../../../shared/components/validate-input/validate-input.component';
import { RegisterFormData, registerSchema } from '../../schemas/auth.schema';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    CardModule,
    DividerModule,
    DropdownModule,
    ProgressSpinnerModule,
    ValidateInputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm!: FormGroup;
  loading$ = this.authService.loading$;

  roleOptions = [
    { label: 'Cliente', value: 'client' },
    { label: 'Barbeiro', value: 'barber' },
    { label: 'Administrador', value: 'admin' },
  ];

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      confirmPassword: [''],
      role: ['client'],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.registerForm.value as RegisterFormData;

    // Validar com Zod
    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      this.handleValidationErrors(validation.error.errors);
      return;
    }

    // Remove confirmPassword antes de enviar
    const { confirmPassword, ...registerData } = validation.data;

    this.authService.register(registerData).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Erro no registro:', error);
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  private handleValidationErrors(errors: any[]): void {
    errors.forEach((error) => {
      const field = error.path[0];
      const control = this.registerForm.get(field);
      if (control) {
        control.setErrors({ zodError: error.message });
        control.markAsTouched();
      }
    });
  }

  getFieldError(fieldName: string): string | null {
    const control = this.registerForm.get(fieldName);
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
