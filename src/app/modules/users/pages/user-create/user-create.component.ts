import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
} from '../../../../shared/components';
import { UserRoles } from '../../../../shared/enums';
import { UserAddressFormComponent } from '../../components/user-address-form/user-address-form.component';
import { UserProfileFormComponent } from '../../components/user-profile-form/user-profile-form.component';
import { CreateUserRequest } from '../../interfaces/user.interface';
import { CreateUserForm, createUserSchema } from '../../schema/user.schema';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    DividerModule,
    PanelMenuModule,
    TabViewModule,
    ToolbarModule,
    TooltipModule,
    SharedHeaderComponent,
    UserProfileFormComponent,
    UserAddressFormComponent,
  ],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent
  extends BaseResourceComponent
  implements OnInit
{
  userForm!: FormGroup;
  addressForm!: FormGroup;
  activeTabIndex = 0;

  menuItems = [
    {
      label: 'Dados do Usuário',
      items: [
        {
          label: 'Perfil',
          icon: 'pi pi-user',
          command: () => {
            this.activeTabIndex = 0;
          },
        },
        {
          label: 'Endereço',
          icon: 'pi pi-map-marker',
          command: () => {
            this.activeTabIndex = 1;
          },
        },
      ],
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService
  ) {
    super();
    this.buildForms();
  }

  public ngOnInit(): void {
    this.setTitle('Criar Usuário', 'Adicionar novo usuário ao sistema');
    this.setBreadcrumb([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Usuários', url: '/users' },
      { label: 'Criar Usuário' },
    ]);
  }

  /**
   * Constrói os formulários reativos.
   */
  private buildForms(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      role: [UserRoles.USER, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.addressForm = this.fb.group({
      street: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      zipCode: [''],
    });
  }

  /**
   * Submete o formulário de criação.
   */
  public onSubmit(): void {
    if (this.userForm.invalid) {
      this.showError('Formulário inválido', 'Verifique os campos obrigatórios');
      return;
    }

    const formData = this.userForm.value as CreateUserForm;

    try {
      const validatedData = createUserSchema.parse(formData);
      const createRequest: CreateUserRequest = {
        ...validatedData,
        address: this.addressForm.valid ? this.addressForm.value : undefined,
      };

      this.startLoading();

      this.userService.create(createRequest).subscribe({
        next: (response) => {
          this.showSuccess('Usuário criado com sucesso!');
          this.goTo(['../list']);
          this.stopLoading();
        },
        error: (error) => {
          this.showError('Erro ao criar usuário', error.message);
          this.stopLoading();
        },
      });
    } catch (error: any) {
      this.showError('Dados inválidos', error.message);
    }
  }

  /**
   * Navega de volta para a lista de usuários.
   */
  public back(): void {
    this.goTo(['../list']);
  }
}
