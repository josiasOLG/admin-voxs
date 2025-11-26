import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../users/services/user.service';
import { AuthService } from '../../../auth/services/auth.service';

/**
 * Componente para dados do agendamento
 */
@Component({
  selector: 'app-appointment-details-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    InputTextarea,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './appointment-details-form.component.html',
  styleUrls: ['./appointment-details-form.component.scss'],
})
export class AppointmentDetailsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  public appointmentForm!: FormGroup;
  public loading = signal<boolean>(false);
  public isEditMode = signal<boolean>(false);
  public appointmentId = signal<string | null>(null);
  public minDate = new Date();

  // Controle de visibilidade e loading
  public dateSelected = signal<boolean>(false);
  public loadingTimeSlots = signal<boolean>(false);
  public loadingModalities = signal<boolean>(false);

  // Dados das APIs
  public timeSlots = signal<string[]>([]);
  public modalityOptions = signal<any[]>([]);

  // Repetição hardcoded
  public repeatOptions = [
    { label: 'Nunca', value: 'never' },
    { label: 'Diariamente', value: 'daily' },
    { label: 'Semanalmente', value: 'weekly' },
    { label: 'Mensalmente', value: 'monthly' },
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
    this.loadFormData();
    this.loadUserAgenda(); // Carrega modalidades da API
  }

  /**
   * Inicializa o formulário
   */
  private initializeForm(): void {
    this.appointmentForm = this.fb.group({
      date: [null, Validators.required],
      time: ['', Validators.required],
      modality: ['', Validators.required],
      repete: ['never', Validators.required],
      notes: [''],
    });
  }

  /**
   * Verifica se está em modo de edição
   */
  private checkEditMode(): void {
    this.route.parent?.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode.set(true);
        this.appointmentId.set(id);
      }
    });
  }

  /**
   * Carrega dados do formulário
   */
  private loadFormData(): void {
    const savedData = sessionStorage.getItem('appointmentDetailsData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        // Converte a data de string para Date
        if (data.date) {
          data.date = new Date(data.date);
          this.dateSelected.set(true);
        }
        this.appointmentForm.patchValue(data);
      } catch (error) {
        console.error('Error loading appointment data:', error);
      }
    }
  }

  /**
   * Carrega agenda do usuário (modalidades)
   * GET /users/:userId/agenda
   */
  private loadUserAgenda(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não autenticado',
      });
      return;
    }

    this.loadingModalities.set(true);
    this.userService.getAgendaConfig(currentUser.id).subscribe({
      next: (response) => {
        // Mapeia as modalidades da API
        const agendaConfig = response.agendaConfig || response;
        const modalities = agendaConfig.modalities?.map((m: string) => ({
          label: m,
          value: m
        })) || [];
        this.modalityOptions.set(modalities);
        this.loadingModalities.set(false);
      },
      error: (error) => {
        console.error('Error loading modalities:', error);
        this.loadingModalities.set(false);
        // Fallback para valores padrão
        this.modalityOptions.set([
          { label: 'Presencial', value: 'Presencial' },
          { label: 'Online', value: 'Online' },
        ]);
      },
    });
  }

  /**
   * Quando seleciona uma data, busca horários disponíveis
   * POST /users/agenda/horas
   */
  public onDateSelect(event: any): void {
    const selectedDate = event;
    if (!selectedDate) return;

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não autenticado',
      });
      return;
    }

    this.dateSelected.set(true);
    this.loadingTimeSlots.set(true);

    // Formata data para ISO (YYYY-MM-DD)
    const dateISO = selectedDate.toISOString().split('T')[0];

    // Chama API via UserService
    this.userService.getAvailableTimeSlots(currentUser.id, dateISO).subscribe({
      next: (response) => {
        // API retorna { availableTimeSlots: ['16:00', '17:00'], date: ... }
        this.timeSlots.set(response.availableTimeSlots || []);
        this.loadingTimeSlots.set(false);

        if (response.availableTimeSlots?.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Atenção',
            detail: 'Não há horários disponíveis para esta data',
          });
        }
      },
      error: (error) => {
        console.error('Error loading time slots:', error);
        this.loadingTimeSlots.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.error || 'Erro ao carregar horários disponíveis',
        });
      },
    });
  }

  /**
   * Volta para etapa anterior
   */
  public previous(): void {
    this.saveFormData();

    if (this.isEditMode()) {
      const id = this.appointmentId();
      this.router.navigate([`/appointment/edit/${id}/client`]);
    } else {
      this.router.navigate(['/appointment/create/client']);
    }
  }

  /**
   * Avança para próxima etapa
   */
  public next(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios',
      });
      return;
    }

    this.saveFormData();

    if (this.isEditMode()) {
      const id = this.appointmentId();
      this.router.navigate([`/appointment/edit/${id}/services`]);
    } else {
      this.router.navigate(['/appointment/create/services']);
    }
  }

  /**
   * Salva dados no sessionStorage
   */
  private saveFormData(): void {
    sessionStorage.setItem(
      'appointmentDetailsData',
      JSON.stringify(this.appointmentForm.value)
    );
  }

  /**
   * Verifica se um campo é inválido
   */
  public isFieldInvalid(fieldName: string): boolean {
    const field = this.appointmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtém mensagem de erro
   */
  public getFieldError(fieldName: string): string {
    const field = this.appointmentForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Campo obrigatório';
    }
    return '';
  }
}
