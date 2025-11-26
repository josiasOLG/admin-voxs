import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { IActivity } from '../../interfaces/app-service.interface';

@Component({
  selector: 'app-activity-table',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.scss'],
})
export class ActivityTableComponent {
  @Input() activities: IActivity[] = [];
  @Input() showAddButton = true;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();
  @Output() toggleActive = new EventEmitter<number>();

  /**
   * Emite evento para adicionar nova atividade.
   */
  public onAdd(): void {
    this.add.emit();
  }

  /**
   * Emite evento para editar atividade.
   *
   * @param index Índice da atividade.
   */
  public onEdit(index: number): void {
    this.edit.emit(index);
  }

  /**
   * Emite evento para remover atividade.
   *
   * @param index Índice da atividade.
   */
  public onRemove(index: number): void {
    this.remove.emit(index);
  }

  /**
   * Emite evento para alternar status da atividade.
   *
   * @param index Índice da atividade.
   */
  public onToggleActive(index: number): void {
    this.toggleActive.emit(index);
  }
}
