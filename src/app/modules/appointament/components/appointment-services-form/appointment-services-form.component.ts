import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AppointmentService } from '../../services';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { UserService } from '../../../users/services/user.service';
import { AuthService } from '../../../auth/services/auth.service';

/**
 * Componente para seleção de serviços
 */
@Component({
  selector: 'app-appointment-services-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ButtonModule,
    CardModule,
    TagModule,
  ],
  providers: [MessageService],
  templateUrl: './appointment-services-form.component.html',
  styleUrls: ['./appointment-services-form.component.scss'],
})
export class AppointmentServicesFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private appointmentService = inject(AppointmentService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  public servicesForm!: FormGroup;
  public loading = signal<boolean>(false);
  public loadingServices = signal<boolean>(false);
  public isEditMode = signal<boolean>(false);
  public appointmentId = signal<string | null>(null);

  public availableServices = signal<any[]>([]);
  public selectedServicesDetails = signal<any[]>([]);

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
    this.loadFormData();
    this.loadServices();
    this.watchServiceSelection();
  }

  /**
   * Inicializa o formulário
   */
  private initializeForm(): void {
    this.servicesForm = this.fb.group({
      service: [[], [Validators.required, Validators.minLength(1)]],
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
    const savedData = sessionStorage.getItem('appointmentServicesData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.servicesForm.patchValue(data);
      } catch (error) {
        console.error('Error loading services data:', error);
      }
    }
  }

  /**
   * Carrega lista de serviços disponíveis da API
   * GET /barber-services/services/:userId
   */
  private loadServices(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não autenticado',
      });
      return;
    }

    this.loadingServices.set(true);
    this.userService.getBarberServices(currentUser.id).subscribe({
      next: (services) => {
        // Mapeia os serviços da API para o formato esperado pelo MultiSelect
        const mappedServices = services.map((service) => ({
          label: service.name,
          value: service._id,
          points: service.points || '0',
          money: service.maney || '0', // Note: API usa 'maney' (typo do backend)
          userId: service.userId,
        }));
        this.availableServices.set(mappedServices);
        this.loadingServices.set(false);
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.loadingServices.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar serviços',
        });
        // Fallback para array vazio
        this.availableServices.set([]);
      },
    });
  }

  /**
   * Observa mudanças na seleção de serviços
   */
  private watchServiceSelection(): void {
    this.servicesForm.get('service')?.valueChanges.subscribe((selected) => {
      const services = this.availableServices();
      const details = services.filter((s) => selected.includes(s.value));
      this.selectedServicesDetails.set(details);
    });
  }

  /**
   * Calcula valor total
   */
  public getTotalPrice(): number {
    return this.selectedServicesDetails().reduce(
      (total, service) => total + (parseFloat(service.money) || 0),
      0
    );
  }

  /**
   * Calcula pontos totais
   */
  public getTotalPoints(): number {
    return this.selectedServicesDetails().reduce(
      (total, service) => total + (parseFloat(service.points) || 0),
      0
    );
  }

  /**
   * Volta para etapa anterior
   */
  public previous(): void {
    this.saveFormData();

    if (this.isEditMode()) {
      const id = this.appointmentId();
      this.router.navigate([`/appointment/edit/${id}/appointment`]);
    } else {
      this.router.navigate(['/appointment/create/appointment']);
    }
  }

  /**
   * Salva o agendamento completo
   */
  public save(): void {
    if (this.servicesForm.invalid) {
      this.servicesForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um serviço',
      });
      return;
    }

    this.loading.set(true);
    this.saveFormData();

    // Coleta todos os dados das etapas
    const clientData = JSON.parse(
      sessionStorage.getItem('appointmentClientData') || '{}'
    );
    const appointmentData = JSON.parse(
      sessionStorage.getItem('appointmentDetailsData') || '{}'
    );
    const servicesData = this.servicesForm.value;

    // Monta payload completo
    const payload = {
      ...clientData,
      ...appointmentData,
      ...servicesData,
    };

    // Cria ou atualiza
    if (this.isEditMode()) {
      const id = this.appointmentId();
      this.appointmentService.update(id!, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Agendamento atualizado com sucesso',
          });
          this.clearSessionStorage();
          this.router.navigate(['/appointment/list']);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error updating appointment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar agendamento',
          });
          this.loading.set(false);
        },
      });
    } else {
      this.appointmentService.create(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Agendamento criado com sucesso',
          });
          this.clearSessionStorage();
          this.router.navigate(['/appointment/list']);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar agendamento',
          });
          this.loading.set(false);
        },
      });
    }
  }

  /**
   * Salva dados no sessionStorage
   */
  private saveFormData(): void {
    sessionStorage.setItem(
      'appointmentServicesData',
      JSON.stringify(this.servicesForm.value)
    );
  }

  /**
   * Limpa sessionStorage
   */
  private clearSessionStorage(): void {
    sessionStorage.removeItem('appointmentClientData');
    sessionStorage.removeItem('appointmentDetailsData');
    sessionStorage.removeItem('appointmentServicesData');
  }

  /**
   * Verifica se campo é inválido
   */
  public isFieldInvalid(fieldName: string): boolean {
    const field = this.servicesForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
