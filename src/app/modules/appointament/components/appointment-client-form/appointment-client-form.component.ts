import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { InputMaskModule } from 'primeng/inputmask';

/**
 * Componente para dados do cliente no formulário de agendamento
 */
@Component({
  selector: 'app-appointment-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputMaskModule,
  ],
  providers: [MessageService],
  templateUrl: './appointment-client-form.component.html',
  styleUrls: ['./appointment-client-form.component.scss'],
})
export class AppointmentClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  public clientForm!: FormGroup;
  public loading = signal<boolean>(false);
  public isEditMode = signal<boolean>(false);
  public appointmentId = signal<string | null>(null);

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
    this.loadFormData();
  }

  /**
   * Inicializa o formulário
   */
  private initializeForm(): void {
    this.clientForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      userNumber: ['', [Validators.required]],
      userEmail: ['', [Validators.required, Validators.email]],
      userCpf: [''], // Opcional
      // Campos de endereço opcionais
      zipCode: [''],
      street: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
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
   * Carrega dados do formulário (do sessionStorage ou API)
   */
  private loadFormData(): void {
    // Tenta carregar do sessionStorage primeiro
    const savedData = sessionStorage.getItem('appointmentClientData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.clientForm.patchValue(data);
      } catch (error) {
        console.error('Error loading client data:', error);
      }
    }

    // Se modo edição, carregar da API
    if (this.isEditMode() && this.appointmentId()) {
      // TODO: Implementar carregamento da API
    }
  }

  /**
   * Salva dados e navega para próxima etapa
   */
  public next(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios',
      });
      return;
    }

    // Salva no sessionStorage
    sessionStorage.setItem(
      'appointmentClientData',
      JSON.stringify(this.clientForm.value)
    );

    // Navega para próxima etapa
    if (this.isEditMode()) {
      const id = this.appointmentId();
      this.router.navigate([`/appointment/edit/${id}/appointment`]);
    } else {
      this.router.navigate(['/appointment/create/appointment']);
    }
  }

  /**
   * Verifica se um campo é inválido
   */
  public isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtém mensagem de erro de um campo
   */
  public getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Campo obrigatório';
      if (field.errors['email']) return 'E-mail inválido';
      if (field.errors['minlength']) return 'Mínimo de caracteres não atingido';
    }
    return '';
  }
}
