import { FormControl, FormGroup, Validators } from '@angular/forms';
import { z } from 'zod';
import { zodValidator } from '../../../shared';

export const CreateAppointmentSchema = z.object({
  _id: z.string().optional(),
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
  idServico: z.string().optional(),
  barberId: z.string().min(1, 'ID do barbeiro é obrigatório'),
  date: z.date(),
  time: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  statusAprovacao: z.string().optional(),
  statusMensage: z.string().optional(),
  service: z.array(z.string()).min(1, 'Pelo menos um serviço é obrigatório'),
  notes: z.string().optional(),
  statusPoint: z.boolean(),
  repete: z.string().optional(),
  allDay: z.boolean(),
  exceptions: z.array(z.date()).optional(),
  endRepeat: z.date().optional(),
  color: z.string().optional(),
  userNumber: z.string().optional(),
  modality: z.string().optional(),
  create: z.date().optional(),
  update: z.date().optional(),
  active: z.boolean(),
});

export type IAppointment = z.infer<typeof CreateAppointmentSchema>;

export function initAppointmentForm(): FormGroup<{
  userId: FormControl<string | null>;
  idServico: FormControl<string | null>;
  barberId: FormControl<string | null>;
  date: FormControl<Date | null>;
  time: FormControl<string | null>;
  status: FormControl<
    'pending' | 'confirmed' | 'cancelled' | 'completed' | null
  >;
  statusAprovacao: FormControl<string | null>;
  statusMensage: FormControl<string | null>;
  service: FormControl<string[] | null>;
  notes: FormControl<string | null>;
  statusPoint: FormControl<boolean | null>;
  repete: FormControl<string | null>;
  allDay: FormControl<boolean | null>;
  exceptions: FormControl<Date[] | null>;
  endRepeat: FormControl<Date | null>;
  color: FormControl<string | null>;
  userNumber: FormControl<string | null>;
  modality: FormControl<string | null>;
}> {
  return new FormGroup({
    userId: new FormControl<string | null>(null, [
      Validators.required,
      zodValidator(CreateAppointmentSchema.shape.userId),
    ]),
    idServico: new FormControl<string | null>(null),
    barberId: new FormControl<string | null>(null, [
      Validators.required,
      zodValidator(CreateAppointmentSchema.shape.barberId),
    ]),
    date: new FormControl<Date | null>(null, [Validators.required]),
    time: new FormControl<string | null>(null),
    status: new FormControl<
      'pending' | 'confirmed' | 'cancelled' | 'completed' | null
    >('pending'),
    statusAprovacao: new FormControl<string | null>(null),
    statusMensage: new FormControl<string | null>(null),
    service: new FormControl<string[] | null>(null, [Validators.required]),
    notes: new FormControl<string | null>(null),
    statusPoint: new FormControl<boolean | null>(false),
    repete: new FormControl<string | null>(null),
    allDay: new FormControl<boolean | null>(false),
    exceptions: new FormControl<Date[] | null>(null),
    endRepeat: new FormControl<Date | null>(null),
    color: new FormControl<string | null>(null),
    userNumber: new FormControl<string | null>(null),
    modality: new FormControl<string | null>(null),
  });
}
