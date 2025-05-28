import { TestBed } from '@angular/core/testing';
import { ValidateInputComponent } from './validate-input.component';
import { FormControl, Validators } from '@angular/forms';

describe('ValidateInputComponent', () => {
  let component: ValidateInputComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ValidateInputComponent],
    });

    const fixture = TestBed.createComponent(ValidateInputComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return false for showErrors when control is valid', () => {
    component.control = new FormControl('valid');
    expect(component.showErrors).toBe(false);
  });

  it('should return true for showErrors when control is invalid and touched', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    component.control = control;
    expect(component.showErrors).toBe(true);
  });

  it('should return "Este campo é obrigatório." for required error', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    component.control = control;
    const errors = component.errorMessages;
    expect(errors).toContain('Este campo é obrigatório.');
  });

  it('should map known _errors messages correctly', () => {
    const control = new FormControl('');
    control.setErrors({
      zod: {
        _errors: [
          'Expected string, received number',
          'Expected number, received string',
        ],
      },
    });
    control.markAsDirty();
    component.control = control;

    expect(component.errorMessages).toEqual([
      'O valor deve ser um texto.',
      'O valor deve ser um número.',
    ]);
  });

  it('should handle custom string errors', () => {
    const control = new FormControl('');
    control.setErrors({ custom: 'Erro customizado' });
    control.markAsDirty();
    component.control = control;

    expect(component.errorMessages).toContain('Erro customizado');
  });

  it('should handle array errors', () => {
    const control = new FormControl('');
    control.setErrors({ list: ['Erro 1', 'Erro 2'] });
    control.markAsDirty();
    component.control = control;

    expect(component.errorMessages).toEqual(['Erro 1', 'Erro 2']);
  });

  it('should fallback for unknown error types', () => {
    const control = new FormControl('');
    control.setErrors({ unknownError: { foo: 'bar' } });
    control.markAsTouched();
    component.control = control;

    expect(component.errorMessages).toContain('Erro: unknownError');
  });
});
