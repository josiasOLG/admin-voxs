import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { EventClickArg, DateSelectArg, EventInput } from '@fullcalendar/core';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
  CalendarComponent
} from '../../../../shared/components';
import { AppointmentService } from '../../services';
import { IAppointment } from '../../schema';
import { MessageService } from 'primeng/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-appointment-calendar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    SharedHeaderComponent,
    CalendarComponent,
  ],
  providers: [MessageService],
  template: `
    <app-shared-header [showBackButton]="false"></app-shared-header>

    <p-card>
      <ng-template pTemplate="header">
        <div class="px-4 pt-3 flex justify-content-between align-items-center">
          <h2 class="m-0">Calendário de Agendamentos</h2>
          <p-button
            label="Novo Agendamento"
            icon="pi pi-plus"
            (onClick)="goToCreate()"
          ></p-button>
        </div>
      </ng-template>

      <app-calendar
        [events]="calendarEvents()"
        [editable]="false"
        [selectable]="true"
        (eventClick)="onEventClick($event)"
        (dateSelect)="onDateSelect($event)"
      />
    </p-card>
  `,
  styles: [`
    :host ::ng-deep {
      .p-card-body {
        padding: 1rem;
      }

      .p-card-content {
        padding: 0;
      }
    }
  `]
})
export class AppointmentCalendarComponent extends BaseResourceComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private messageService = inject(MessageService);

  public calendarEvents = signal<EventInput[]>([]);
  private appointments: IAppointment[] = [];

  ngOnInit(): void {
    this.setBreadcrumb([
      { label: 'Agendamentos' },
      { label: 'Calendário' },
    ]);
    this.loadAppointments();
  }

  private loadAppointments(): void {
    this.startLoading();
    this.appointmentService.getAll().subscribe({
      next: (response: any) => {
        this.appointments = response;
        this.convertToCalendarEvents(response);
        this.stopLoading();
      },
      error: (error: any) => {
        console.error('Error loading appointments:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar agendamentos',
        });
        this.stopLoading();
      },
    });
  }

  private convertToCalendarEvents(appointments: IAppointment[]): void {
    const events: EventInput[] = appointments.map((apt: any) => {
      const dateStr = typeof apt.date === 'string' ? apt.date : apt.date.toISOString();
      const startDateTime = `${dateStr.split('T')[0]}T${apt.time}`;
      const appointmentId = apt.id || apt._id;

      return {
        id: appointmentId,
        title: `${apt.time} - ${apt.userName || 'Cliente'}`,
        start: startDateTime,
        end: this.calculateEndTime(startDateTime, 60), // 60 minutos de duração padrão
        allDay: false,
        extendedProps: {
          status: apt.status || 'pending',
          userName: apt.userName || 'Cliente',
          barberName: apt.barberName || 'Barbeiro',
          service: apt.service || [],
          appointment: apt,
        }
      };
    });

    console.log('[Calendar] Eventos convertidos:', events);
    this.calendarEvents.set(events);
  }

  private calculateEndTime(startDateTime: string, durationMinutes: number): string {
    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    return end.toISOString();
  }

  public onEventClick(clickInfo: EventClickArg): void {
    const appointmentId = clickInfo.event.id;
    if (appointmentId) {
      this.goTo(`/appointment/edit/${appointmentId}`);
    }
  }

  public onDateSelect(selectInfo: DateSelectArg): void {
    // Quando selecionar uma data/horário, abre o formulário de criação
    const selectedDate = selectInfo.start;
    const selectedTime = format(selectedDate, 'HH:mm', { locale: ptBR });
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd', { locale: ptBR });

    this.messageService.add({
      severity: 'info',
      summary: 'Nova Data Selecionada',
      detail: `${selectedDateStr} às ${selectedTime}`,
    });

    // Navegar para create com query params
    this.goTo('/appointment/create', {
      queryParams: {
        date: selectedDateStr,
        time: selectedTime,
      }
    });
  }

  public goToCreate(): void {
    this.goTo('/appointment/create');
  }
}
