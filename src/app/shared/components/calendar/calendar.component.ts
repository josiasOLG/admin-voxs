import { Component, input, output, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, DateSelectArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

/**
 * Calendário tradicional bonito com visualização mensal em grid
 * Mostra todos os agendamentos de forma organizada e elegante
 */
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, ButtonModule, CardModule],
  template: `
    <p-card styleClass="calendar-card">
      <div class="calendar-container">
        <full-calendar [options]="calendarOptions()"></full-calendar>
      </div>
    </p-card>
  `,
  styles: [`
    .calendar-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }

    .calendar-container {
      width: 100%;
      min-height: 700px;
      background: white;
    }

    :host ::ng-deep {
      /* Container principal */
      .fc {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: white;
        border-radius: 8px;
      }

      /* Cabeçalho do calendário */
      .fc-toolbar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 12px 12px 0 0;
        margin-bottom: 0;
        border-bottom: none;
      }

      .fc-toolbar-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: white;
        letter-spacing: -0.025em;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      /* Botões do cabeçalho */
      .fc-button-group .fc-button,
      .fc-button {
        background: rgba(255, 255, 255, 0.15) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        color: white !important;
        padding: 0.6rem 1.2rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.875rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        margin: 0 2px;
      }

      .fc-button:hover {
        background: rgba(255, 255, 255, 0.25) !important;
        border-color: rgba(255, 255, 255, 0.4) !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .fc-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .fc-button-active {
        background: white !important;
        color: #667eea !important;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      /* Grid do calendário */
      .fc-scrollgrid {
        border: none !important;
        border-radius: 0 0 12px 12px;
        overflow: hidden;
      }

      .fc-scrollgrid-section > * {
        border: none !important;
      }

      /* Cabeçalho dos dias da semana */
      .fc-col-header {
        background: #f8fafc;
        border-bottom: 2px solid #e2e8f0;
      }

      .fc-col-header-cell {
        background: #f8fafc;
        padding: 1rem 0.5rem;
        border: none !important;
        border-right: 1px solid #e2e8f0 !important;
      }

      .fc-col-header-cell:last-child {
        border-right: none !important;
      }

      .fc-col-header-cell-cushion {
        color: #475569;
        font-weight: 700;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0;
      }

      /* Células dos dias */
      .fc-daygrid-day {
        min-height: 120px !important;
        background: white;
        border-right: 1px solid #e2e8f0 !important;
        border-bottom: 1px solid #e2e8f0 !important;
        transition: all 0.2s ease;
        position: relative;
      }

      .fc-daygrid-day:hover {
        background: #f8fafc;
        transform: scale(1.01);
        box-shadow: inset 0 0 0 2px #667eea;
      }

      .fc-daygrid-day:last-child {
        border-right: none !important;
      }

      .fc-daygrid-day-frame {
        padding: 8px;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      /* Números dos dias */
      .fc-daygrid-day-number {
        color: #334155;
        font-weight: 600;
        font-size: 0.95rem;
        padding: 4px 8px;
        border-radius: 6px;
        align-self: flex-start;
        min-width: 28px;
        text-align: center;
        transition: all 0.2s ease;
      }

      .fc-daygrid-day-number:hover {
        background: #667eea;
        color: white;
      }

      /* Dia atual */
      .fc-day-today {
        background: #fef3c7 !important;
        border-color: #f59e0b !important;
      }

      .fc-day-today .fc-daygrid-day-number {
        background: #f59e0b;
        color: white;
        font-weight: 700;
        box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
      }

      /* Dias de outros meses */
      .fc-day-other .fc-daygrid-day-number {
        color: #94a3b8;
      }

      .fc-day-other {
        background: #f8fafc;
      }

      /* Eventos/Agendamentos */
      .fc-event {
        border: none !important;
        border-radius: 6px !important;
        padding: 4px 8px !important;
        margin: 1px 0 !important;
        font-size: 0.8rem !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        backdrop-filter: blur(10px);
      }

      .fc-event:hover {
        transform: translateY(-1px) scale(1.02) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        z-index: 10;
      }

      .fc-event-title {
        font-weight: 600;
        font-size: 0.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fc-event-time {
        font-size: 0.75rem;
        opacity: 0.9;
        font-weight: 500;
      }

      /* Cores por status de agendamento */
      .fc-event.event-pending {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%) !important;
        color: #78350f !important;
        border-left: 4px solid #d97706 !important;
      }

      .fc-event.event-aprovado {
        background: linear-gradient(135deg, #34d399 0%, #10b981 100%) !important;
        color: #064e3b !important;
        border-left: 4px solid #059669 !important;
      }

      .fc-event.event-rejeitado {
        background: linear-gradient(135deg, #f87171 0%, #ef4444 100%) !important;
        color: #7f1d1d !important;
        border-left: 4px solid #dc2626 !important;
      }

      .fc-event.event-cancelled {
        background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%) !important;
        color: #1f2937 !important;
        border-left: 4px solid #4b5563 !important;
      }

      /* Mais eventos */
      .fc-daygrid-more-link {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        border-radius: 4px !important;
        padding: 2px 6px !important;
        font-size: 0.75rem !important;
        font-weight: 600 !important;
        border: none !important;
        margin-top: 2px !important;
        transition: all 0.2s ease !important;
      }

      .fc-daygrid-more-link:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
      }

      /* Popover para mais eventos */
      .fc-popover {
        border: none !important;
        border-radius: 12px !important;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        overflow: hidden;
        backdrop-filter: blur(20px);
      }

      .fc-popover-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        padding: 12px 16px !important;
        font-weight: 600 !important;
      }

      .fc-popover-body {
        padding: 8px 0 !important;
        background: white;
      }
    }
  `]
})
export class CalendarComponent implements OnInit {
  // Inputs
  public events = input<EventInput[]>([]);
  public initialDate = input<Date | string>(new Date());
  public editable = input<boolean>(false);
  public selectable = input<boolean>(true);

  // Outputs
  public eventClick = output<EventClickArg>();
  public dateSelect = output<DateSelectArg>();
  public eventDrop = output<any>();

  // Computed calendar options
  public calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: ptBrLocale,
    initialDate: this.initialDate(),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    events: this.events(),
    editable: this.editable(),
    selectable: this.selectable(),
    selectMirror: true,
    dayMaxEvents: 3,
    moreLinkClick: 'popover',
    weekends: true,
    height: 'auto',
    contentHeight: 700,
    aspectRatio: 1.5,
    nowIndicator: false,
    eventDisplay: 'block',
    displayEventTime: true,
    displayEventEnd: false,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    eventClick: (clickInfo: EventClickArg) => {
      this.eventClick.emit(clickInfo);
    },
    select: (selectInfo: DateSelectArg) => {
      this.dateSelect.emit(selectInfo);
    },
    eventDrop: (dropInfo: any) => {
      if (this.editable()) {
        this.eventDrop.emit(dropInfo);
      }
    },
    eventClassNames: (arg) => {
      const status = arg.event.extendedProps['status'] || 'pending';
      return [`event-${status}`];
    },
    eventContent: (arg) => {
      const time = arg.timeText;
      const title = arg.event.title;
      const userName = arg.event.extendedProps['userName'] || '';
      const status = arg.event.extendedProps['status'] || '';
      
      const statusMap: { [key: string]: string } = {
        'pending': 'Pendente',
        'aprovado': 'Aprovado',
        'rejeitado': 'Rejeitado',
        'cancelled': 'Cancelado'
      };
      
      const statusText = statusMap[status] || status;
      
      return {
        html: `
          <div class="fc-event-custom" title="${title} - ${userName} (${statusText})">
            <div class="fc-event-time">${time}</div>
            <div class="fc-event-title">${userName || title}</div>
          </div>
        `
      };
    },
    dayCellContent: (arg) => {
      return arg.dayNumberText;
    },
    firstDay: 0,
    weekNumbers: false,
    weekText: 'Sem',
    allDayText: 'Todo o dia',
    moreLinkText: (n) => `+${n} mais`,
    noEventsText: 'Nenhum agendamento',
    navLinks: true,
    navLinkDayClick: (date) => {
      this.dateSelect.emit({
        start: date,
        end: date,
        startStr: date.toISOString().split('T')[0],
        endStr: date.toISOString().split('T')[0],
        allDay: true,
        view: {} as any,
        jsEvent: {} as any
      });
    }
  }));

  ngOnInit(): void {
    console.log('[Calendar] Componente inicializado');
    console.log('[Calendar] Eventos recebidos:', this.events());
  }
}