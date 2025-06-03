import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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
import { IActivity, ICategory } from '../../interfaces/app-service.interface';
import { createAppServiceSchema } from '../../schema/app-service.schema';
import { AppServiceService } from '../../services/app-service.service';

@Component({
  selector: 'app-app-service-create',
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
    TabViewModule,
    TagModule,
    TooltipModule,
    SharedHeaderComponent,
  ],
  templateUrl: './app-service-create.component.html',
  styleUrls: ['./app-service-create.component.scss'],
})
export class AppServiceCreateComponent
  extends BaseResourceComponent
  implements OnInit
{
  readonly form: FormGroup;
  readonly isSubmitting = signal(false);

  // Data arrays - vazios no modo criação
  readonly activitiesData = signal<IActivity[]>([]);
  readonly categoriesData = signal<ICategory[]>([]);

  constructor(
    private readonly fb: FormBuilder,
    router: Router,
    private readonly appServiceService: AppServiceService
  ) {
    super();
    this.form = this.createForm();
  }

  public ngOnInit(): void {
    this.setTitle('Criar App Service', 'Cadastrar novo serviço da aplicação');
    this.setBreadcrumb([
      { label: 'Dashboard', url: AppRoutes.DASHBOARD },
      { label: 'App Services', url: AppRoutes.APP_SERVICES },
      { label: 'Criar' },
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
   * Submete o formulário.
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

    const validation = createAppServiceSchema.safeParse(formData);

    if (!validation.success) {
      this.showError('Dados inválidos', 'Verifique os campos do formulário');
      return;
    }

    this.isSubmitting.set(true);

    this.appServiceService.create(validation.data).subscribe({
      next: (createdService) => {
        this.showSuccess('App Service criado com sucesso!');
        // Redireciona para a edição para permitir adicionar categorias e atividades
        this.goTo([AppRoutes.APP_SERVICES, AppRoutes.LIST]);
      },
      error: (error) => {
        this.showError('Erro ao criar app service', error.message);
        this.isSubmitting.set(false);
      },
    });
  }

  /**
   * Cancela a criação e volta para a listagem.
   */
  public onCancel(): void {
    this.goTo([AppRoutes.APP_SERVICES, AppRoutes.LIST]);
  }
}
