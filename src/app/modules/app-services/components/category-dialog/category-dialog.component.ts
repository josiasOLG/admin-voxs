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
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ICategory } from '../../interfaces/app-service.interface';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputSwitchModule,
    InputTextModule,
  ],
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
})
export class CategoryDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() category: ICategory | null = null;
  @Input() isEdit = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ICategory>();
  @Output() cancel = new EventEmitter<void>();

  readonly form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.createForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      if (this.category) {
        this.form.patchValue(this.category);
      } else {
        this.form.reset({
          name: '',
          active: true,
        });
      }
    }
  }

  /**
   * Cria o formulário de categoria.
   *
   * @returns FormGroup configurado.
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
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
        active: true,
      });
    }
    this.visibleChange.emit(visible);
  }

  /**
   * Salva a categoria.
   */
  public onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value as ICategory);
  }

  /**
   * Cancela o dialog.
   */
  public onCancel(): void {
    // Força o fechamento do dialog primeiro
    this.onVisibleChange(false);
    this.cancel.emit();
  }

  /**
   * Obtém o título do dialog.
   *
   * @returns Título baseado no modo de edição.
   */
  public get dialogTitle(): string {
    return this.isEdit ? 'Editar Categoria' : 'Nova Categoria';
  }
}
