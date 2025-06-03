import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { UserRoles } from '../../../../shared/enums';

@Component({
  selector: 'app-user-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  template: `
    <div class="grid" [formGroup]="formGroup">
      <div class="col-12 md:col-6">
        <label for="name" class="block text-900 font-medium mb-2">
          Nome Completo
        </label>
        <input
          id="name"
          type="text"
          pInputText
          formControlName="name"
          class="w-full"
          placeholder="Digite o nome completo"
          [class.ng-dirty]="formGroup.get('name')?.dirty"
          [class.ng-invalid]="
            formGroup.get('name')?.invalid && formGroup.get('name')?.touched
          "
        />

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('name')?.invalid && formGroup.get('name')?.touched
          "
        >
          {{ getFieldError('name') }}
        </small>
      </div>

      <div class="col-12 md:col-6">
        <label for="email" class="block text-900 font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          pInputText
          formControlName="email"
          class="w-full"
          placeholder="Digite o email"
          [class.ng-dirty]="formGroup.get('email')?.dirty"
          [class.ng-invalid]="
            formGroup.get('email')?.invalid && formGroup.get('email')?.touched
          "
        />

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('email')?.invalid && formGroup.get('email')?.touched
          "
        >
          {{ getFieldError('email') }}
        </small>
      </div>

      <div class="col-12 md:col-6">
        <label for="phone" class="block text-900 font-medium mb-2">
          Telefone <span class="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          pInputText
          formControlName="phone"
          class="w-full"
          placeholder="(11) 99999-9999"
          [class.ng-dirty]="formGroup.get('phone')?.dirty"
          [class.ng-invalid]="
            formGroup.get('phone')?.invalid && formGroup.get('phone')?.touched
          "
        />

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('phone')?.invalid && formGroup.get('phone')?.touched
          "
        >
          {{ getFieldError('phone') }}
        </small>
      </div>

      <div class="col-12 md:col-6">
        <label for="role" class="block text-900 font-medium mb-2">
          Tipo de Usuário <span class="text-red-500">*</span>
        </label>
        <p-select
          id="role"
          formControlName="role"
          [options]="roleOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecione o tipo"
          class="w-full"
          appendTo="body"
          [class.ng-dirty]="formGroup.get('role')?.dirty"
          [class.ng-invalid]="
            formGroup.get('role')?.invalid && formGroup.get('role')?.touched
          "
        >
        </p-select>

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('role')?.invalid && formGroup.get('role')?.touched
          "
        >
          {{ getFieldError('role') }}
        </small>
      </div>

      <div class="col-12 md:col-6" *ngIf="showPasswordField">
        <label for="password" class="block text-900 font-medium mb-2">
          Senha <span class="text-red-500">*</span>
        </label>
        <p-password
          id="password"
          formControlName="password"
          placeholder="Digite a senha"
          [feedback]="true"
          [toggleMask]="true"
          class="w-full"
          [class.ng-dirty]="formGroup.get('password')?.dirty"
          [class.ng-invalid]="
            formGroup.get('password')?.invalid &&
            formGroup.get('password')?.touched
          "
        >
        </p-password>

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('password')?.invalid &&
            formGroup.get('password')?.touched
          "
        >
          {{ getFieldError('password') }}
        </small>
      </div>
    </div>
  `,
  styleUrls: ['./user-profile-form.component.scss'],
})
export class UserProfileFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() showPasswordField = false;

  readonly roleOptions = [
    { label: 'Cliente', value: UserRoles.USER },
    { label: 'Barbeiro', value: UserRoles.BARBER },
    { label: 'Administrador', value: UserRoles.ADMIN },
  ];

  /**
   * Retorna a mensagem de erro para um campo específico.
   *
   * @param fieldName Nome do campo.
   * @returns Mensagem de erro.
   */
  public getFieldError(fieldName: string): string {
    const field = this.formGroup.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return 'Este campo é obrigatório';
    if (errors['email']) return 'Email inválido';
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `Deve ter pelo menos ${requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `Deve ter no máximo ${requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }
}
