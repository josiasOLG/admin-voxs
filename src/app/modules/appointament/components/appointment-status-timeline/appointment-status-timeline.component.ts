import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { FormattedAppointment } from '../../interfaces/appointment.interface';

interface TimelineEvent {
  status: string;
  date?: Date | string;
  message?: string;
  icon: string;
  color: string;
}

/**
 * Componente de timeline para histórico de status do agendamento.
 * Utiliza PrimeNG Timeline para visualização cronológica.
 * Segue padrões: Standalone, Signals, KISS.
 */
@Component({
  selector: 'app-appointment-status-timeline',
  standalone: true,
  imports: [CommonModule, TimelineModule, CardModule, TagModule],
  templateUrl: './appointment-status-timeline.component.html',
  styleUrl: './appointment-status-timeline.component.scss',
})
export class AppointmentStatusTimelineComponent {
  public appointment = input.required<FormattedAppointment>();

  /**
   * Eventos da timeline baseados no status do agendamento
   */
  public events = computed<TimelineEvent[]>(() => {
    const app = this.appointment();
    const timeline: TimelineEvent[] = [];

    // Criação
    if (app.create) {
      timeline.push({
        status: 'Criado',
        date: app.create,
        message: 'Agendamento criado',
        icon: 'pi-plus-circle',
        color: 'info',
      });
    }

    // Aprovação/Rejeição
    if (app.statusAprovacao === 'aprovado') {
      timeline.push({
        status: 'Aprovado',
        date: app.update,
        message: 'Agendamento aprovado',
        icon: 'pi-check-circle',
        color: 'success',
      });
    } else if (app.statusAprovacao === 'rejeitado') {
      timeline.push({
        status: 'Rejeitado',
        date: app.update,
        message: app.statusMensage || 'Agendamento rejeitado',
        icon: 'pi-times-circle',
        color: 'danger',
      });
    }

    // Status atual
    if (app.status === 'completed') {
      timeline.push({
        status: 'Concluído',
        date: app.update,
        message: 'Agendamento concluído',
        icon: 'pi-check',
        color: 'success',
      });
    } else if (app.status === 'cancelled') {
      timeline.push({
        status: 'Cancelado',
        date: app.update,
        message: 'Agendamento cancelado',
        icon: 'pi-ban',
        color: 'secondary',
      });
    } else if (app.status === 'no-show') {
      timeline.push({
        status: 'Não Compareceu',
        date: app.update,
        message: 'Cliente não compareceu',
        icon: 'pi-user-minus',
        color: 'danger',
      });
    }

    return timeline;
  });

  /**
   * Formata data para exibição
   */
  public formatDate(date?: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
