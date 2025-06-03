import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, Signal } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { BaseResourceComponent } from '../../../../shared/components';
import { ICategory } from '../../interfaces/app-service.interface';
import { AppServiceService } from '../../services/app-service.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { CategoryTableComponent } from '../category-table/category-table.component';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoryDialogComponent,
    CategoryTableComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
})
export class CategoriesFormComponent extends BaseResourceComponent {
  @Input() categoriesData = signal<ICategory[]>([]);
  @Input() serviceId!: Signal<string | null>;

  private readonly appServiceService = inject(AppServiceService);

  // Dialog states
  readonly showCategoryDialog = signal(false);
  readonly editingCategoryIndex = signal<number | null>(null);
  readonly currentCategory = signal<ICategory | null>(null);

  /**
   * Abre o dialog para criar nova categoria.
   */
  public addCategory(): void {
    this.editingCategoryIndex.set(null);
    this.currentCategory.set(null);
    this.showCategoryDialog.set(true);
  }

  /**
   * Edita uma categoria existente.
   *
   * @param index Índice da categoria.
   */
  public editCategory(index: number): void {
    const category = this.categoriesData()[index];
    this.editingCategoryIndex.set(index);
    this.currentCategory.set(category);
    this.showCategoryDialog.set(true);
  }

  /**
   * Salva a categoria no array ou via API.
   *
   * @param category Dados da categoria.
   */
  public onCategorySave(category: ICategory): void {
    const serviceId = this.serviceId();

    if (!serviceId) {
      // Modo criação - salvar apenas no array local
      this.saveToLocalArray(category);
      return;
    }

    const editIndex = this.editingCategoryIndex();

    if (editIndex !== null && category._id) {
      // Edição via API
      this.startLoading();
      this.appServiceService
        .updateCategory(serviceId, category._id, {
          name: category.name,
          active: category.active,
        })
        .subscribe({
          next: (updatedCategory) => {
            this.updateLocalCategory(editIndex, updatedCategory);
            this.showSuccess('Categoria atualizada com sucesso!');
            this.onCategoryCancel();
            this.stopLoading();
          },
          error: (error) => {
            this.showError('Erro ao atualizar categoria', error.message);
            this.stopLoading();
          },
        });
    } else {
      // Criação via API
      this.startLoading();
      this.appServiceService
        .addCategory(serviceId, {
          name: category.name,
          active: category.active,
        })
        .subscribe({
          next: (newCategory) => {
            this.addToLocalArray(newCategory);
            this.showSuccess('Categoria criada com sucesso!');
            this.onCategoryCancel();
            this.stopLoading();
          },
          error: (error) => {
            this.showError('Erro ao criar categoria', error.message);
            this.stopLoading();
          },
        });
    }
  }

  /**
   * Remove uma categoria do array ou via API.
   *
   * @param index Índice da categoria.
   */
  public removeCategory(index: number): void {
    const category = this.categoriesData()[index];
    const serviceId = this.serviceId();

    if (!serviceId || !category._id) {
      console.log('ServiceId:', serviceId);
      console.log('Category._id:', category._id);
      // Modo criação - remover apenas do array local
      this.removeFromLocalArray(index);
      return;
    }

    // Remoção via API
    this.startLoading();
    this.appServiceService.removeCategory(serviceId, category._id).subscribe({
      next: () => {
        this.removeFromLocalArray(index);
        this.showSuccess('Categoria removida com sucesso!');
        this.stopLoading();
      },
      error: (error) => {
        this.showError('Erro ao remover categoria', error.message);
        this.stopLoading();
      },
    });
  }

  /**
   * Salva categoria no array local (modo criação).
   *
   * @param category Dados da categoria.
   */
  private saveToLocalArray(category: ICategory): void {
    const currentCategories = [...this.categoriesData()];
    const editIndex = this.editingCategoryIndex();

    if (editIndex !== null) {
      currentCategories[editIndex] = category;
    } else {
      currentCategories.push(category);
    }

    this.categoriesData.set(currentCategories);
    this.onCategoryCancel();
  }

  /**
   * Atualiza categoria no array local.
   *
   * @param index Índice da categoria.
   * @param category Categoria atualizada.
   */
  private updateLocalCategory(index: number, category: ICategory): void {
    const currentCategories = [...this.categoriesData()];
    currentCategories[index] = category;
    this.categoriesData.set(currentCategories);
  }

  /**
   * Adiciona categoria ao array local.
   *
   * @param category Nova categoria.
   */
  private addToLocalArray(category: ICategory): void {
    const currentCategories = [...this.categoriesData()];
    currentCategories.push(category);
    this.categoriesData.set(currentCategories);
  }

  /**
   * Remove categoria do array local.
   *
   * @param index Índice da categoria.
   */
  private removeFromLocalArray(index: number): void {
    const currentCategories = [...this.categoriesData()];
    currentCategories.splice(index, 1);
    this.categoriesData.set(currentCategories);
  }

  /**
   * Alterna o status ativo de uma categoria.
   *
   * @param index Índice da categoria.
   */
  public toggleCategoryActive(index: number): void {
    const category = this.categoriesData()[index];
    const serviceId = this.serviceId();

    if (!serviceId || !category._id) {
      // Modo criação - alterar apenas no array local
      this.toggleLocalCategoryActive(index);
      return;
    }

    // Toggle via API
    this.startLoading();
    this.appServiceService
      .toggleCategoryActive(serviceId, category._id)
      .subscribe({
        next: (updatedCategory) => {
          this.updateLocalCategory(index, updatedCategory);
          this.showSuccess(
            `Categoria ${
              updatedCategory.active ? 'ativada' : 'desativada'
            } com sucesso!`
          );
          this.stopLoading();
        },
        error: (error) => {
          this.showError('Erro ao alterar status da categoria', error.message);
          this.stopLoading();
        },
      });
  }

  /**
   * Alterna o status ativo no array local.
   *
   * @param index Índice da categoria.
   */
  private toggleLocalCategoryActive(index: number): void {
    const currentCategories = [...this.categoriesData()];
    currentCategories[index] = {
      ...currentCategories[index],
      active: !currentCategories[index].active,
    };
    this.categoriesData.set(currentCategories);
  }

  /**
   * Cancela o dialog de categoria.
   */
  public onCategoryCancel(): void {
    this.showCategoryDialog.set(false);
    // Usa timeout para garantir que o backdrop seja removido
    setTimeout(() => {
      this.editingCategoryIndex.set(null);
      this.currentCategory.set(null);
    }, 100);
  }
}
