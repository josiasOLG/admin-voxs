import { Component, input, output, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextarea } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { FormattedAppointment } from '../../interfaces/appointment.interface';
import { ProfessionalProfileService } from '../../../../core/professional-profiles/services/professional-profile.service';

/**
 * Componente de diálogo para aprovar/rejeitar agendamentos.
 * Utiliza PrimeNG Dialog para design consistente.
 * Segue padrões: Standalone, Signals, SOLID, DRY.
 */
@Component({
  selector: 'app-appointment-approval-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextarea,
    MessageModule,
  ],
  templateUrl: './appointment-approval-dialog.component.html',
  styleUrl: './appointment-approval-dialog.component.scss',
})
export class AppointmentApprovalDialogComponent {
  private readonly profileService = inject(ProfessionalProfileService);

  // Inputs
  public appointment = input<FormattedAppointment | null>(null);
  public visible = input<boolean>(false);
  public mode = input<'approve' | 'reject'>('approve');
  public loading = input<boolean>(false);

  // Outputs
  public approved = output<string>();
  public rejected = output<{ id: string; reason: string }>();
  public closed = output<void>();

  // Signals
  public terminology = this.profileService.terminology;

  // Form para rejeição
  public rejectForm = new FormGroup({
    reason: new FormControl<string>('', [Validators.required, Validators.minLength(10)]),
  });

  constructor() {
    // Reset form quando o dialog fechar
    effect(() => {
      if (!this.visible()) {
        this.rejectForm.reset();
      }
    });
  }

  /**
   * Confirma aprovação
   */
  public confirmApprove(): void {
    const app = this.appointment();
    if (app && app.id) {
      this.approved.emit(app.id);
    }
  }

  /**
   * Confirma rejeição
   */
  public confirmReject(): void {
    if (this.rejectForm.valid) {
      const app = this.appointment();
      const reason = this.rejectForm.value.reason!;
      if (app && app.id) {
        this.rejected.emit({ id: app.id, reason });
      }
    }
  }

  /**
   * Fecha o dialog
   */
  public close(): void {
    this.closed.emit();
  }

  /**
   * Formata data para exibição
   */
  public formatDate(date?: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }

  /**
   * Formata serviços para exibição
   */
  public formatServices(services?: string[]): string {
    if (!services || services.length === 0) return '-';
    return services.join(', ');
  }
}
