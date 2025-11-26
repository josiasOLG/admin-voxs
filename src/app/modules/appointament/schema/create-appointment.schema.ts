import { FormControl, FormGroup, Validators } from '@angular/forms';
import { z } from 'zod';
import { zodValidator } from '../../../shared';

/**
 * Address schema
 */
export const AddressSchema = z.object({
  street: z.string(),
  number: z.string(),
  complement: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
});

/**
 * Schema completo para validação de agendamentos.
 * Baseado na entidade Appointment da APIBarbearia.
 */
export const CreateAppointmentSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
  idServico: z.string().optional(),
  barberId: z.string().min(1, 'ID do profissional é obrigatório'),
  date: z.coerce.date(),
  time: z.string().min(1, 'Horário é obrigatório'),
  status: z.enum(['pending', 'aprovado', 'rejeitado', 'completed', 'cancelled', 'no-show']).optional(),
  statusAprovacao: z.enum(['pending', 'aprovado', 'rejeitado']).optional(),
  statusMensage: z.string().optional(),
  service: z.array(z.string()).min(1, 'Pelo menos um serviço é obrigatório'),
  notes: z.string().optional(),
  statusPoint: z.boolean().optional(),
  repete: z.enum(['none', 'daily', 'weekly', 'monthly']).optional(),
  allDay: z.boolean().optional(),
  exceptions: z.array(z.coerce.date()).optional(),
  endRepeat: z.coerce.date().optional(),
  color: z.string().optional(),
  userNumber: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  userCpf: z.string().optional(),
  userAddress: AddressSchema.optional(),
  modality: z.enum(['presencial', 'online', 'domicilio']).optional(),
  create: z.coerce.date().optional(),
  update: z.coerce.date().optional(),
  active: z.boolean().optional(),
  manual: z.boolean().optional(),
  hashuser: z.string().optional(),
  // Campos formatados para exibição (somente leitura)
  barberName: z.string().optional(),
  userImage: z.string().optional(),
  userBirthDate: z.coerce.date().optional(),
  userDescription: z.string().optional(),
  userPoints: z.number().optional(),
  serviceNames: z.array(z.string()).optional(),
});

export type IAppointment = z.infer<typeof CreateAppointmentSchema>;

/**
 * Inicializa formulário reativo para agendamento.
 * Segue padrão Angular Reactive Forms com validação Zod.
 */
export function initAppointmentForm(): FormGroup<{
  userId: FormControl<string | null>;
  idServico: FormControl<string | null>;
  barberId: FormControl<string | null>;
  date: FormControl<Date | null>;
  time: FormControl<string | null>;
  status: FormControl<'pending' | 'aprovado' | 'rejeitado' | 'completed' | 'cancelled' | 'no-show' | null>;
  statusAprovacao: FormControl<'pending' | 'aprovado' | 'rejeitado' | null>;
  statusMensage: FormControl<string | null>;
  service: FormControl<string[] | null>;
  notes: FormControl<string | null>;
  statusPoint: FormControl<boolean | null>;
  repete: FormControl<'none' | 'daily' | 'weekly' | 'monthly' | null>;
  allDay: FormControl<boolean | null>;
  exceptions: FormControl<Date[] | null>;
  endRepeat: FormControl<Date | null>;
  color: FormControl<string | null>;
  userNumber: FormControl<string | null>;
  userName: FormControl<string | null>;
  userEmail: FormControl<string | null>;
  userCpf: FormControl<string | null>;
  modality: FormControl<'presencial' | 'online' | 'domicilio' | null>;
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
    time: new FormControl<string | null>(null, [Validators.required]),
    status: new FormControl<'pending' | 'aprovado' | 'rejeitado' | 'completed' | 'cancelled' | 'no-show' | null>('pending'),
    statusAprovacao: new FormControl<'pending' | 'aprovado' | 'rejeitado' | null>('pending'),
    statusMensage: new FormControl<string | null>(null),
    service: new FormControl<string[] | null>(null, [Validators.required]),
    notes: new FormControl<string | null>(null),
    statusPoint: new FormControl<boolean | null>(false),
    repete: new FormControl<'none' | 'daily' | 'weekly' | 'monthly' | null>('none'),
    allDay: new FormControl<boolean | null>(false),
    exceptions: new FormControl<Date[] | null>(null),
    endRepeat: new FormControl<Date | null>(null),
    color: new FormControl<string | null>(null),
    userNumber: new FormControl<string | null>(null),
    userName: new FormControl<string | null>(null),
    userEmail: new FormControl<string | null>(null),
    userCpf: new FormControl<string | null>(null),
    modality: new FormControl<'presencial' | 'online' | 'domicilio' | null>('presencial'),
  });
}
