import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ZodTypeAny } from 'zod';

/**
 * Cria um validador do Angular baseado em um schema Zod
 */
export function zodValidator(schema: ZodTypeAny): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined) return null;
    const result = schema.safeParse(control.value);
    return result.success ? null : { zod: result.error.format() };
  };
}
