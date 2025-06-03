import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { IActivity } from '../../interfaces/app-service.interface';

@Component({
  selector: 'app-activity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextModule,
  ],
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.scss'],
})
export class ActivityDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() activity: IActivity | null = null;
  @Input() isEdit = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<IActivity>();
  @Output() cancel = new EventEmitter<void>();

  readonly form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.createForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      if (this.activity) {
        this.form.patchValue(this.activity);
      } else {
        this.form.reset({
          name: '',
          point: 1,
          active: true,
        });
      }
    }
  }

  /**
   * Cria o formulário de atividade.
   *
   * @returns FormGroup configurado.
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      point: [1, [Validators.required, Validators.min(1)]],
      active: [true],
    });
  }

  /**
   * Atualiza a visibilidade do dialog.
   *
   * @param visible Nova visibilidade.
   */
  public onVisibleChange(visible: boolean): void {
    if (!visible) {
      // Reseta o formulário quando fecha o dialog
      this.form.reset({
        name: '',
        point: 1,
        active: true,
      });
    }
    this.visibleChange.emit(visible);
  }

  /**
   * Salva a atividade.
   */
  public onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value as IActivity);
  }

  /**
   * Cancela o dialog.
   */
  public onCancel(): void {
    // Força o fechamento do dialog primeiro
    this.onVisibleChange(false);
    this.cancel.emit();
    this.visible = false;
  }

  /**
   * Obtém o título do dialog.
   *
   * @returns Título baseado no modo de edição.
   */
  public get dialogTitle(): string {
    return this.isEdit ? 'Editar Atividade' : 'Nova Atividade';
  }
}
