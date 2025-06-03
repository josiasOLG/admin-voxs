import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-user-address-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  template: `
    <div class="grid" [formGroup]="formGroup">
      <div class="col-12 md:col-3">
        <label for="zipCode" class="block text-900 font-medium mb-2">
          CEP
        </label>
        <p-inputMask
          id="zipCode"
          mask="99999-999"
          formControlName="zipCode"
          placeholder="00000-000"
          class="w-full"
          [class.ng-dirty]="formGroup.get('zipCode')?.dirty"
          [class.ng-invalid]="
            formGroup.get('zipCode')?.invalid &&
            formGroup.get('zipCode')?.touched
          "
        >
        </p-inputMask>

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('zipCode')?.invalid &&
            formGroup.get('zipCode')?.touched
          "
        >
          {{ getFieldError('zipCode') }}
        </small>
      </div>

      <div class="col-12 md:col-6">
        <label for="street" class="block text-900 font-medium mb-2">
          Rua/Logradouro
        </label>
        <input
          id="street"
          type="text"
          pInputText
          formControlName="street"
          class="w-full"
          placeholder="Digite a rua"
          [class.ng-dirty]="formGroup.get('street')?.dirty"
          [class.ng-invalid]="
            formGroup.get('street')?.invalid && formGroup.get('street')?.touched
          "
        />

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('street')?.invalid && formGroup.get('street')?.touched
          "
        >
          {{ getFieldError('street') }}
        </small>
      </div>

      <div class="col-12 md:col-3">
        <label for="number" class="block text-900 font-medium mb-2">
          Número
        </label>
        <input
          id="number"
          type="text"
          pInputText
          formControlName="number"
          class="w-full"
          placeholder="123"
          [class.ng-dirty]="formGroup.get('number')?.dirty"
          [class.ng-invalid]="
            formGroup.get('number')?.invalid && formGroup.get('number')?.touched
          "
        />

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('number')?.invalid && formGroup.get('number')?.touched
          "
        >
          {{ getFieldError('number') }}
        </small>
      </div>

      <div class="col-12 md:col-6">
        <label for="complement" class="block text-900 font-medium mb-2">
          Complemento
        </label>
        <input
          id="complement"
          type="text"
          pInputText
          formControlName="complement"
          class="w-full"
          placeholder="Apartamento, casa, etc."
          [class.ng-dirty]="formGroup.get('complement')?.dirty"
          [class.ng-invalid]="
            formGroup.get('complement')?.invalid &&
            formGroup.get('complement')?.touched
          "
        />
      </div>

      <div class="col-12 md:col-6">
        <label for="neighborhood" class="block text-900 font-medium mb-2">
          Bairro
        </label>
        <input
          id="neighborhood"
          type="text"
          pInputText
          formControlName="neighborhood"
          class="w-full"
          placeholder="Digite o bairro"
          [class.ng-dirty]="formGroup.get('neighborhood')?.dirty"
          [class.ng-invalid]="
            formGroup.get('neighborhood')?.invalid &&
            formGroup.get('neighborhood')?.touched
          "
        />

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('neighborhood')?.invalid &&
            formGroup.get('neighborhood')?.touched
          "
        >
          {{ getFieldError('neighborhood') }}
        </small>
      </div>

      <div class="col-12 md:col-8">
        <label for="city" class="block text-900 font-medium mb-2">
          Cidade
        </label>
        <input
          id="city"
          type="text"
          pInputText
          formControlName="city"
          class="w-full"
          placeholder="Digite a cidade"
          [class.ng-dirty]="formGroup.get('city')?.dirty"
          [class.ng-invalid]="
            formGroup.get('city')?.invalid && formGroup.get('city')?.touched
          "
        />

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('city')?.invalid && formGroup.get('city')?.touched
          "
        >
          {{ getFieldError('city') }}
        </small>
      </div>

      <div class="col-12 md:col-4">
        <label for="state" class="block text-900 font-medium mb-2">
          Estado
        </label>
        <input
          id="state"
          type="text"
          pInputText
          formControlName="state"
          class="w-full"
          placeholder="SP"
          maxlength="2"
          [class.ng-dirty]="formGroup.get('state')?.dirty"
          [class.ng-invalid]="
            formGroup.get('state')?.invalid && formGroup.get('state')?.touched
          "
        />

        <small
          class="p-error block mt-1"
          *ngIf="
            formGroup.get('state')?.invalid && formGroup.get('state')?.touched
          "
        >
          {{ getFieldError('state') }}
        </small>
      </div>
    </div>
  `,
  styleUrls: ['./user-address-form.component.scss'],
})
export class UserAddressFormComponent {
  @Input() formGroup!: FormGroup;

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
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `Deve ter pelo menos ${requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `Deve ter no máximo ${requiredLength} caracteres`;
    }
    if (errors['pattern']) return 'Formato inválido';

    return 'Campo inválido';
  }
}
