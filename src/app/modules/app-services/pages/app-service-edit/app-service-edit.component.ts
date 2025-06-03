import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
} from '../../../../shared/components';
import { AppRoutes } from '../../../../shared/constants/app.routes';
import { ActivitiesFormComponent } from '../../components/activities-form/activities-form.component';
import { CategoriesFormComponent } from '../../components/categories-form/categories-form.component';
import {
  AppService,
  IActivity,
  ICategory,
} from '../../interfaces/app-service.interface';
import { updateAppServiceSchema } from '../../schema/app-service.schema';
import { AppServiceService } from '../../services/app-service.service';

@Component({
  selector: 'app-service-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextModule,
    TextareaModule,
    PanelModule,
    TableModule,
    TagModule,
    TabViewModule,
    TooltipModule,
    SharedHeaderComponent,
    ActivitiesFormComponent,
    CategoriesFormComponent,
  ],
  templateUrl: './app-service-edit.component.html',
  styleUrls: ['./app-service-edit.component.scss'],
})
export class AppServiceEditComponent
  extends BaseResourceComponent
  implements OnInit
{
  readonly form: FormGroup;
  readonly isSubmitting = signal(false);

  // Data arrays
  readonly activitiesData = signal<IActivity[]>([]);
  readonly categoriesData = signal<ICategory[]>([]);

  // Service data - pega o ID da URL
  readonly serviceIdSignal = this.getRouteParam('id');

  constructor(
    private readonly fb: FormBuilder,
    protected override readonly route: ActivatedRoute,
    protected override readonly router: Router,
    private readonly appServiceService: AppServiceService
  ) {
    super();
    this.form = this.createForm();
  }

  public ngOnInit(): void {
    const data = this.route.snapshot.data['appService'] as AppService;
    this.populateForm(data);

    this.setTitle('Editar App Service', `Editar serviço: ${data.name}`);
    this.setBreadcrumb([
      { label: 'Dashboard', url: AppRoutes.DASHBOARD },
      { label: 'App Services', url: AppRoutes.APP_SERVICES },
      { label: 'Editar' },
    ]);
  }

  /**
   * Cria o formulário principal.
   *
   * @returns FormGroup configurado.
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [null, [Validators.min(0)]],
      duration: [null, [Validators.min(1)]],
      active: [true],
    });
  }

  /**
   * Popula o formulário com os dados do serviço.
   *
   * @param data Dados do serviço.
   */
  private populateForm(data: AppService): void {
    this.form.patchValue({
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration,
      active: data.active,
    });

    if (data.activities) {
      this.activitiesData.set(data.activities);
    }

    if (data.categories) {
      this.categoriesData.set(data.categories);
    }
  }

  /**
   * Submete o formulário de atualização.
   */
  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.form.value,
      activities: this.activitiesData(),
      categories: this.categoriesData(),
    };

    const validation = updateAppServiceSchema.safeParse(formData);

    if (!validation.success) {
      this.showError('Dados inválidos', 'Verifique os campos do formulário');
      return;
    }

    this.isSubmitting.set(true);

    const serviceId = this.serviceIdSignal();
    if (!serviceId) {
      this.showError('ID do serviço não encontrado');
      this.isSubmitting.set(false);
      return;
    }

    this.appServiceService.update(serviceId, validation.data).subscribe({
      next: () => {
        this.showSuccess('App Service atualizado com sucesso!');
        this.goTo([AppRoutes.APP_SERVICES, AppRoutes.LIST]);
      },
      error: (error) => {
        this.showError('Erro ao atualizar app service', error.message);
        this.isSubmitting.set(false);
      },
    });
  }

  /**
   * Cancela a edição e volta para a listagem.
   */
  public onCancel(): void {
    this.goTo([AppRoutes.APP_SERVICES, AppRoutes.LIST]);
  }
}
