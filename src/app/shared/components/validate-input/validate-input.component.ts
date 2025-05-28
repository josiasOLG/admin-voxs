import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validate-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validate-input.component.html',
})
export class ValidateInputComponent {
  @Input() control!: AbstractControl | null;
  @Input() error: string | null = null;

  get showErrors(): boolean {
    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  get errorMessages(): string[] {
    if (!this.control?.errors) return [];

    const messages: string[] = [];

    for (const errorKey of Object.keys(this.control.errors)) {
      const error = this.control.errors[errorKey];

      if (error && typeof error === 'object' && '_errors' in error) {
        for (const msg of error._errors) {
          if (msg === 'Expected string, received number') {
            messages.push('O valor deve ser um texto.');
          } else if (msg === 'Expected number, received string') {
            messages.push('O valor deve ser um número.');
          } else {
            messages.push(msg);
          }
        }
      } else if (typeof error === 'string') {
        messages.push(error);
      } else if (Array.isArray(error)) {
        messages.push(...error);
      } else if (errorKey === 'required') {
        messages.push('Este campo é obrigatório.');
      } else if (typeof error === 'boolean') {
      } else {
        messages.push(`Erro: ${errorKey}`);
      }
    }

    return messages;
  }
}
