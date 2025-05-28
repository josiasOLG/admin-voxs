import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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

import { ApiResponse, AppRoutes } from '../../../../shared';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
  ValidateInputComponent,
} from '../../../../shared/components';
import { IAppointment, initAppointmentForm } from '../../schema';
import { AppointmentService } from '../../services';

@Component({
  standalone: true,
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss'],
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
    SharedHeaderComponent,
    ValidateInputComponent,
  ],
})
export class AppointmentEditComponent
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
    const appointment =
      this.getRouteData<ApiResponse<IAppointment>>('appointments');
    this.setBreadcrumb([
      { label: 'Agendamentos', url: `/${AppRoutes.APPOINTMENTS}` },
      { label: 'Editar Agendamento' },
    ]);
    const data = appointment?.data;
    if (data && !Array.isArray(data)) {
      this.form.patchValue(data);
    }
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.startLoading();
    const raw = this.form.getRawValue();

    const payload: Partial<IAppointment> = {
      userId: raw.userId ?? undefined,
      barberId: raw.barberId ?? undefined,
      idServico: raw.idServico ?? undefined,
      date: raw.date ?? undefined,
      time: raw.time ?? undefined,
      status:
        (raw.status as 'pending' | 'confirmed' | 'cancelled' | 'completed') ??
        undefined,
      statusAprovacao: raw.statusAprovacao ?? undefined,
      statusMensage: raw.statusMensage ?? undefined,
      service: raw.service ?? undefined,
      notes: raw.notes ?? undefined,
      statusPoint: raw.statusPoint ?? undefined,
      repete: raw.repete ?? undefined,
      allDay: raw.allDay ?? undefined,
      exceptions: raw.exceptions ?? undefined,
      endRepeat: raw.endRepeat ?? undefined,
      color: raw.color ?? undefined,
      userNumber: raw.userNumber ?? undefined,
      modality: raw.modality ?? undefined,
    };

    this.appointmentService.update(id, payload).subscribe({
      next: () => {
        this.showSuccess('Agendamento atualizado com sucesso');
        this.goTo([AppRoutes.APPOINTMENTS]);
      },
      error: (err: any) => {
        this.showError('Erro ao atualizar agendamento', err?.message || '');
      },
      complete: () => {
        this.stopLoading();
        this.goTo(`/${AppRoutes.APPOINTMENTS}`);
      },
    });
  }

  public back = () => {
    this.backViewlink(`/${AppRoutes.APPOINTMENTS}/${AppRoutes.LIST}`);
  };
}
