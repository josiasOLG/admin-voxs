import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';

/**
 * Componente reutilizável para inputs com label em cima.
 * Suporta diversos tipos de inputs do PrimeNG.
 * Padrão: Standalone, Signals, KISS
 */
@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextarea,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    InputMaskModule,
    CheckboxModule,
    InputNumberModule,
  ],
  template: `
    <div class="input-field-container" [class.input-field-error]="hasError()">
      <!-- Label -->
      <label
        [for]="inputId()"
        class="input-field-label"
        [class.required]="required()"
      >
        {{ label() }}
      </label>

      <!-- Input Text -->
      @if (type() === 'text' || type() === 'email' || type() === 'password') {
        <input
          pInputText
          [id]="inputId()"
          [type]="type()"
          [formControl]="control()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          class="w-full"
        />
      }

      <!-- Textarea -->
      @if (type() === 'textarea') {
        <textarea
          pInputTextarea
          [id]="inputId()"
          [formControl]="control()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [rows]="rows()"
          class="w-full"
        ></textarea>
      }

      <!-- Calendar -->
      @if (type() === 'calendar') {
        <p-calendar
          [inputId]="inputId()"
          [formControl]="control()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [showIcon]="true"
          [dateFormat]="dateFormat()"
          [appendTo]="'body'"
          [showTime]="showTime()"
          [timeOnly]="timeOnly()"
          [touchUI]="false"
          [hideOnDateTimeSelect]="true"
          [showOnFocus]="true"
          styleClass="w-full calendar-input"
          inputStyleClass="w-full"
          panelStyleClass="calendar-panel-custom"
        />
      }

      <!-- Dropdown -->
      @if (type() === 'dropdown') {
        <p-dropdown
          [inputId]="inputId()"
          [formControl]="control()"
          [options]="options()"
          [optionLabel]="optionLabel()"
          [optionValue]="optionValue()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [filter]="filter()"
          [appendTo]="'body'"
          [autoDisplayFirst]="false"
          styleClass="w-full"
          panelStyleClass="dropdown-panel-custom"
        />
      }

      <!-- MultiSelect -->
      @if (type() === 'multiselect') {
        <p-multiSelect
          [inputId]="inputId()"
          [formControl]="control()"
          [options]="options()"
          [optionLabel]="optionLabel()"
          [optionValue]="optionValue()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [filter]="filter()"
          [appendTo]="'body'"
          styleClass="w-full"
          panelStyleClass="multiselect-panel-custom"
          [display]="'chip'"
        />
      }

      <!-- Input Mask -->
      @if (type() === 'mask') {
        <p-inputMask
          [id]="inputId()"
          [formControl]="control()"
          [mask]="mask()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          styleClass="w-full"
        />
      }

      <!-- Input Number -->
      @if (type() === 'number') {
        <p-inputNumber
          [inputId]="inputId()"
          [formControl]="control()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [min]="min()"
          [max]="max()"
          [minFractionDigits]="minFractionDigits()"
          [maxFractionDigits]="maxFractionDigits()"
          [prefix]="prefix()"
          [suffix]="suffix()"
          styleClass="w-full"
          inputStyleClass="w-full"
        />
      }

      <!-- Checkbox -->
      @if (type() === 'checkbox') {
        <div class="flex align-items-center gap-2">
          <p-checkbox
            [inputId]="inputId()"
            [formControl]="control()"
            [binary]="true"
            [disabled]="disabled()"
          />
          @if (checkboxLabel()) {
            <label [for]="inputId()" class="cursor-pointer">
              {{ checkboxLabel() }}
            </label>
          }
        </div>
      }

      <!-- Error Message -->
      @if (hasError() && errorMessage()) {
        <small class="input-field-error-message">
          {{ errorMessage() }}
        </small>
      }

      <!-- Helper Text -->
      @if (helperText() && !hasError()) {
        <small class="input-field-helper">
          {{ helperText() }}
        </small>
      }
    </div>
  `,
  styles: [`
    .input-field-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .input-field-label {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-color);
      display: block;
    }

    .input-field-label.required::after {
      content: ' *';
      color: var(--red-500);
    }

    .input-field-error-message {
      color: var(--red-500);
      font-size: 0.75rem;
      margin-top: -0.25rem;
    }

    .input-field-helper {
      color: var(--text-color-secondary);
      font-size: 0.75rem;
      margin-top: -0.25rem;
    }

    .input-field-error :deep(.p-inputtext),
    .input-field-error :deep(.p-dropdown),
    .input-field-error :deep(.p-multiselect),
    .input-field-error :deep(.p-calendar input),
    .input-field-error :deep(.p-inputnumber input) {
      border-color: var(--red-500);
    }

    /* Garantir que inputs ocupem largura total */
    :deep(.p-inputtext),
    :deep(.p-dropdown),
    :deep(.p-multiselect),
    :deep(.p-calendar),
    :deep(.p-inputmask),
    :deep(.p-inputnumber) {
      width: 100%;
    }

    :deep(.p-calendar input),
    :deep(.p-inputnumber input) {
      width: 100%;
    }

    /* Estilos específicos para o calendário */
    :deep(.calendar-input) {
      width: 100%;
    }

    :deep(.calendar-panel-custom) {
      z-index: 10000 !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    /* Garantir que o overlay do calendário tenha z-index correto */
    :deep(.p-calendar-panel) {
      z-index: 10000 !important;
    }

    /* Botão do calendário */
    :deep(.p-datepicker-trigger) {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
      transition: all 0.2s;
    }

    :deep(.p-datepicker-trigger:hover) {
      background-color: var(--primary-600);
      border-color: var(--primary-600);
    }

    /* Dropdown e MultiSelect panels */
    :deep(.dropdown-panel-custom),
    :deep(.multiselect-panel-custom) {
      z-index: 10000 !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    :deep(.p-dropdown-panel),
    :deep(.p-multiselect-panel) {
      z-index: 10000 !important;
    }
  `]
})
export class InputFieldComponent {
  // Inputs básicos
  public label = input.required<string>();
  public control = input.required<FormControl>();
  public type = input<'text' | 'email' | 'password' | 'textarea' | 'calendar' | 'dropdown' | 'multiselect' | 'mask' | 'number' | 'checkbox'>('text');
  public placeholder = input<string>('');
  public disabled = input<boolean>(false);
  public required = input<boolean>(false);
  public helperText = input<string>('');
  public inputId = input<string>('');

  // Textarea
  public rows = input<number>(3);

  // Calendar
  public dateFormat = input<string>('dd/mm/yy');
  public showTime = input<boolean>(false);
  public timeOnly = input<boolean>(false);

  // Dropdown/MultiSelect
  public options = input<any[]>([]);
  public optionLabel = input<string>('label');
  public optionValue = input<string>('value');
  public filter = input<boolean>(true);

  // Mask
  public mask = input<string>('');

  // Number
  public min = input<number | undefined>(undefined);
  public max = input<number | undefined>(undefined);
  public minFractionDigits = input<number>(0);
  public maxFractionDigits = input<number>(2);
  public prefix = input<string>('');
  public suffix = input<string>('');

  // Checkbox
  public checkboxLabel = input<string>('');

  // State
  public errorMessage = signal<string>('');
  public hasError = signal<boolean>(false);

  constructor() {
    // Effect para monitorar erros do FormControl
    effect(() => {
      const ctrl = this.control();
      if (ctrl) {
        if (ctrl.invalid && (ctrl.dirty || ctrl.touched)) {
          this.hasError.set(true);
          this.updateErrorMessage();
        } else {
          this.hasError.set(false);
          this.errorMessage.set('');
        }
      }
    });
  }

  private updateErrorMessage(): void {
    const ctrl = this.control();
    if (!ctrl || !ctrl.errors) {
      return;
    }

    const errors = ctrl.errors;

    if (errors['required']) {
      this.errorMessage.set('Campo obrigatório');
    } else if (errors['email']) {
      this.errorMessage.set('E-mail inválido');
    } else if (errors['minlength']) {
      this.errorMessage.set(`Mínimo de ${errors['minlength'].requiredLength} caracteres`);
    } else if (errors['maxlength']) {
      this.errorMessage.set(`Máximo de ${errors['maxlength'].requiredLength} caracteres`);
    } else if (errors['min']) {
      this.errorMessage.set(`Valor mínimo: ${errors['min'].min}`);
    } else if (errors['max']) {
      this.errorMessage.set(`Valor máximo: ${errors['max'].max}`);
    } else if (errors['pattern']) {
      this.errorMessage.set('Formato inválido');
    } else {
      this.errorMessage.set('Campo inválido');
    }
  }
}
