import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, Signal } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { BaseResourceComponent } from '../../../../shared/components';
import { IActivity } from '../../interfaces/app-service.interface';
import { AppServiceService } from '../../services/app-service.service';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { ActivityTableComponent } from '../activity-table/activity-table.component';

@Component({
  selector: 'app-activities-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActivityDialogComponent,
    ActivityTableComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  templateUrl: './activities-form.component.html',
  styleUrls: ['./activities-form.component.scss'],
})
export class ActivitiesFormComponent extends BaseResourceComponent {
  @Input() activitiesData = signal<IActivity[]>([]);
  @Input() serviceId!: Signal<string | null>;

  private readonly appServiceService = inject(AppServiceService);

  // Dialog states
  readonly showActivityDialog = signal(false);
  readonly editingActivityIndex = signal<number | null>(null);
  readonly currentActivity = signal<IActivity | null>(null);

  /**
   * Abre o dialog para criar nova atividade.
   */
  public addActivity(): void {
    this.editingActivityIndex.set(null);
    this.currentActivity.set(null);
    this.showActivityDialog.set(true);
  }

  /**
   * Edita uma atividade existente.
   *
   * @param index Índice da atividade.
   */
  public editActivity(index: number): void {
    const activity = this.activitiesData()[index];
    this.editingActivityIndex.set(index);
    this.currentActivity.set(activity);
    this.showActivityDialog.set(true);
  }

  /**
   * Salva a atividade no array ou via API.
   *
   * @param activity Dados da atividade.
   */
  public onActivitySave(activity: IActivity): void {
    const serviceId = this.serviceId();

    if (!serviceId) {
      // Modo criação - salvar apenas no array local
      this.saveToLocalArray(activity);
      return;
    }

    const editIndex = this.editingActivityIndex();

    if (editIndex !== null && activity._id) {
      // Edição via API
      this.startLoading();
      this.appServiceService
        .updateActivity(serviceId, activity._id, {
          name: activity.name,
          point: activity.point,
          active: activity.active,
        })
        .subscribe({
          next: (updatedActivity) => {
            this.updateLocalActivity(editIndex, updatedActivity);
            this.showSuccess('Atividade atualizada com sucesso!');
            this.onActivityCancel();
            this.stopLoading();
          },
          error: (error) => {
            this.showError('Erro ao atualizar atividade', error.message);
            this.stopLoading();
          },
        });
    } else {
      // Criação via API
      this.startLoading();
      this.appServiceService
        .addActivity(serviceId, {
          name: activity.name,
          point: activity.point,
          active: activity.active,
        })
        .subscribe({
          next: (newActivity) => {
            this.addToLocalArray(newActivity);
            this.showSuccess('Atividade criada com sucesso!');
            this.onActivityCancel();
            this.stopLoading();
          },
          error: (error) => {
            this.showError('Erro ao criar atividade', error.message);
            this.stopLoading();
          },
        });
    }
  }

  /**
   * Remove uma atividade do array ou via API.
   *
   * @param index Índice da atividade.
   */
  public removeActivity(index: number): void {
    const activity = this.activitiesData()[index];
    const serviceId = this.serviceId();

    if (!serviceId || !activity._id) {
      // Modo criação - remover apenas do array local
      this.removeFromLocalArray(index);
      return;
    }

    // Remoção via API
    this.startLoading();
    this.appServiceService.removeActivity(serviceId, activity._id).subscribe({
      next: () => {
        this.removeFromLocalArray(index);
        this.showSuccess('Atividade removida com sucesso!');
        this.stopLoading();
      },
      error: (error) => {
        this.showError('Erro ao remover atividade', error.message);
        this.stopLoading();
      },
    });
  }

  /**
   * Salva atividade no array local (modo criação).
   *
   * @param activity Dados da atividade.
   */
  private saveToLocalArray(activity: IActivity): void {
    const currentActivities = [...this.activitiesData()];
    const editIndex = this.editingActivityIndex();

    if (editIndex !== null) {
      currentActivities[editIndex] = activity;
    } else {
      currentActivities.push(activity);
    }

    this.activitiesData.set(currentActivities);
    this.onActivityCancel();
  }

  /**
   * Atualiza atividade no array local.
   *
   * @param index Índice da atividade.
   * @param activity Atividade atualizada.
   */
  private updateLocalActivity(index: number, activity: IActivity): void {
    const currentActivities = [...this.activitiesData()];
    currentActivities[index] = activity;
    this.activitiesData.set(currentActivities);
  }

  /**
   * Adiciona atividade ao array local.
   *
   * @param activity Nova atividade.
   */
  private addToLocalArray(activity: IActivity): void {
    const currentActivities = [...this.activitiesData()];
    currentActivities.push(activity);
    this.activitiesData.set(currentActivities);
  }

  /**
   * Remove atividade do array local.
   *
   * @param index Índice da atividade.
   */
  private removeFromLocalArray(index: number): void {
    const currentActivities = [...this.activitiesData()];
    currentActivities.splice(index, 1);
    this.activitiesData.set(currentActivities);
  }

  /**
   * Alterna o status ativo de uma atividade.
   *
   * @param index Índice da atividade.
   */
  public toggleActivityActive(index: number): void {
    const activity = this.activitiesData()[index];
    const serviceId = this.serviceId();

    if (!serviceId || !activity._id) {
      // Modo criação - alterar apenas no array local
      this.toggleLocalActivityActive(index);
      return;
    }

    // Toggle via API
    this.startLoading();
    this.appServiceService
      .toggleActivityActive(serviceId, activity._id)
      .subscribe({
        next: (updatedActivity) => {
          this.updateLocalActivity(index, updatedActivity);
          this.showSuccess(
            `Atividade ${
              updatedActivity.active ? 'ativada' : 'desativada'
            } com sucesso!`
          );
          this.stopLoading();
        },
        error: (error) => {
          this.showError('Erro ao alterar status da atividade', error.message);
          this.stopLoading();
        },
      });
  }

  /**
   * Alterna o status ativo no array local.
   *
   * @param index Índice da atividade.
   */
  private toggleLocalActivityActive(index: number): void {
    const currentActivities = [...this.activitiesData()];
    currentActivities[index] = {
      ...currentActivities[index],
      active: !currentActivities[index].active,
    };
    this.activitiesData.set(currentActivities);
  }

  /**
   * Cancela o dialog de atividade.
   */
  public onActivityCancel(): void {
    this.showActivityDialog.set(false);
    // Usa timeout para garantir que o backdrop seja removido
    setTimeout(() => {
      this.editingActivityIndex.set(null);
      this.currentActivity.set(null);
    }, 100);
  }
}
