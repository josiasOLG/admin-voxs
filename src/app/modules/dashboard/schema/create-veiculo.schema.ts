import { FormControl, FormGroup, Validators } from '@angular/forms';
import { z } from 'zod';
import { zodValidator } from '../../../shared';

export const CreateVeiculoSchema = z.object({
  id: z.number().optional(),
  placa: z.string().min(7, 'Placa deve conter ao menos 7 caracteres'),
  chassi: z.string().length(17, 'Chassi deve conter exatamente 17 caracteres'),
  renavam: z.string().min(9, 'Renavam inválido'),
  modelo: z.string().min(2, 'Modelo é obrigatório'),
  ano: z.string(),
});

export type IVeiculo = z.infer<typeof CreateVeiculoSchema>;

export function initVeiculoForm(): FormGroup<{
  placa: FormControl<string | null>;
  chassi: FormControl<string | null>;
  renavam: FormControl<string | null>;
  modelo: FormControl<string | null>;
  ano: FormControl<string | null>;
}> {
  return new FormGroup({
    placa: new FormControl<string | null>(null, [
      Validators.required,
      zodValidator(CreateVeiculoSchema.shape.placa),
    ]),
    chassi: new FormControl<string | null>(null, [
      Validators.required,
      zodValidator(CreateVeiculoSchema.shape.chassi),
    ]),
    renavam: new FormControl<string | null>(null, [
      Validators.required,
      zodValidator(CreateVeiculoSchema.shape.renavam),
    ]),
    modelo: new FormControl<string | null>(null, [
      Validators.required,
      zodValidator(CreateVeiculoSchema.shape.modelo),
    ]),
    ano: new FormControl<string | null>(null, [
      Validators.required,
      zodValidator(CreateVeiculoSchema.shape.ano),
    ]),
  });
}
