import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppRoutes } from '../../../../shared';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
  ValidateInputComponent,
} from '../../../../shared/components';
import { initAppointmentForm } from '../../schema';
import { AppointmentService } from '../../services';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    FloatLabelModule,
    InputTextModule,
    InputTextarea,
    MultiSelectModule,
    CheckboxModule,
    CardModule,
    ValidateInputComponent,
    SharedHeaderComponent,
  ],
  standalone: true,
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss'],
})
export class AppointmentCreateComponent
  extends BaseResourceComponent
  implements OnInit
{
  public form = initAppointmentForm();
  private readonly appointmentService = inject(AppointmentService);

  public statusOptions = [
    { label: 'Pendente', value: 'pending' },
    { label: 'Confirmado', value: 'confirmed' },
    { label: 'Cancelado', value: 'cancelled' },
    { label: 'Concluído', value: 'completed' },
  ];

  public serviceOptions = [
    { label: 'Corte de Cabelo', value: 'haircut' },
    { label: 'Barba', value: 'beard' },
    { label: 'Bigode', value: 'mustache' },
    { label: 'Sobrancelha', value: 'eyebrow' },
    { label: 'Hidratação', value: 'hydration' },
  ];

  public modalityOptions = [
    { label: 'Presencial', value: 'presencial' },
    { label: 'Domicílio', value: 'domicilio' },
  ];

  ngOnInit(): void {
    this.setBreadcrumb([
      { label: 'Agendamentos', url: `/${AppRoutes.APPOINTMENTS}` },
      { label: 'Criar Agendamento' },
    ]);
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.startLoading();
    const raw = this.form.getRawValue();

    // Validate required fields
    if (!raw.date) {
      this.showError('Data é obrigatória');
      this.stopLoading();
      return;
    }

    const payload = {
      userId: raw.userId || '',
      barberId: raw.barberId || '',
      date: raw.date,
      service: raw.service || [],
      status:
        (raw.status as 'pending' | 'confirmed' | 'cancelled' | 'completed') ||
        'pending',
      statusPoint: raw.statusPoint || false,
      allDay: raw.allDay || false,
      ...(raw.idServico && { idServico: raw.idServico }),
      ...(raw.time && { time: raw.time }),
      ...(raw.statusAprovacao && { statusAprovacao: raw.statusAprovacao }),
      ...(raw.statusMensage && { statusMensage: raw.statusMensage }),
      ...(raw.notes && { notes: raw.notes }),
      ...(raw.repete && { repete: raw.repete }),
      ...(raw.exceptions && { exceptions: raw.exceptions }),
      ...(raw.endRepeat && { endRepeat: raw.endRepeat }),
      ...(raw.color && { color: raw.color }),
      ...(raw.userNumber && { userNumber: raw.userNumber }),
      ...(raw.modality && { modality: raw.modality }),
    };
    this.appointmentService.create(payload).subscribe({
      next: (createdAppointment: any) => {
        this.showSuccess('Agendamento criado com sucesso');
        this.goTo([AppRoutes.APPOINTMENTS]);
      },
      error: (err: any) => {
        this.showError('Erro ao criar agendamento', err?.message || '');
      },
      complete: () => {
        this.stopLoading();
      },
    });
  }

  public back = () => {
    this.backViewlink(`/${AppRoutes.APPOINTMENTS}/${AppRoutes.LIST}`);
  };
}
