import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ICategory } from '../../interfaces/app-service.interface';

@Component({
  selector: 'app-category-table',
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
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.scss'],
})
export class CategoryTableComponent {
  @Input() categories: ICategory[] = [];
  @Input() showAddButton = true;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();
  @Output() toggleActive = new EventEmitter<number>();

  /**
   * Emite evento para adicionar nova categoria.
   */
  public onAdd(): void {
    this.add.emit();
  }

  /**
   * Emite evento para editar categoria.
   *
   * @param index Índice da categoria.
   */
  public onEdit(index: number): void {
    this.edit.emit(index);
  }

  /**
   * Emite evento para remover categoria.
   *
   * @param index Índice da categoria.
   */
  public onRemove(index: number): void {
    this.remove.emit(index);
  }

  /**
   * Emite evento para alternar status da categoria.
   *
   * @param index Índice da categoria.
   */
  public onToggleActive(index: number): void {
    this.toggleActive.emit(index);
  }
}
