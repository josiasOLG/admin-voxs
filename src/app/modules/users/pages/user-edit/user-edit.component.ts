import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutes } from '../../../../shared';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
} from '../../../../shared/components';
import { UserAddressFormComponent } from '../../components/user-address-form/user-address-form.component';
import { UserProfileFormComponent } from '../../components/user-profile-form/user-profile-form.component';
import { User } from '../../interfaces/user.interface';
import {
  UpdateUserForm,
  updateUserSchema,
  userAddressSchema,
} from '../../schema/user.schema';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    SharedHeaderComponent,
    UserProfileFormComponent,
    UserAddressFormComponent,
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent extends BaseResourceComponent implements OnInit {
  readonly user = signal<User | null>(null);
  userForm!: FormGroup;
  addressForm!: FormGroup;
  activeTabIndex = 0;

  get userBarberServices() {
    return this.user()?.barberServices || [];
  }

  get userTypeService() {
    return this.user()?.typeService || '';
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService
  ) {
    super();
    this.buildForms();
  }

  public ngOnInit(): void {
    this.setTitle('Editar Usuário', 'Modificar informações do usuário');
    this.loadUserData();
    this.setBreadcrumb([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Usuários', url: '/users' },
      { label: 'Editar Usuário' },
    ]);
  }

  /**
   * Constrói os formulários reativos.
   */
  private buildForms(): void {
    this.userForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      role: [''],
      isActive: [true],
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
   * Carrega os dados do usuário para edição.
   */
  private loadUserData(): void {
    const userData = this.route.snapshot.data?.['user'];

    if (userData) {
      this.user.set(userData);
      this.populateUserForm(userData);
      this.populateAddressForm(userData);
    } else {
      this.showError('Usuário não encontrado');
      this.goBack();
    }
  }

  /**
   * Popula o formulário com os dados do usuário.
   *
   * @param userData Dados do usuário completos do resolver.
   */
  private populateUserForm(userData: User): void {
    this.userForm.patchValue({
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role,
      isActive: userData.active ?? userData.isActive ?? true,
    });
  }

  /**
   * Popula o formulário de endereço com o primeiro endereço do usuário.
   *
   * @param userData Dados do usuário completos do resolver.
   */
  private populateAddressForm(userData: User): void {
    if (userData.addresses && userData.addresses.length > 0) {
      const primaryAddress = userData.addresses[0];
      this.addressForm.patchValue({
        street: primaryAddress.street || '',
        number: primaryAddress.number || '',
        complement: primaryAddress.complement || '',
        neighborhood: primaryAddress.neighborhood || '',
        city: primaryAddress.city || '',
        state: primaryAddress.state || '',
        zipCode: primaryAddress.zipCode || '',
      });
    }
  }

  /**
   * Submete o formulário de edição.
   */
  public onSubmit(): void {
    const currentUser = this.user();
    if (!currentUser) {
      this.showError('Dados do usuário não encontrados');
      return;
    }

    const formData = this.userForm.value as UpdateUserForm;

    try {
      const validatedData = updateUserSchema.parse(formData);
      const userId = currentUser.id || currentUser._id;

      if (!userId) {
        this.showError('ID do usuário não encontrado');
        return;
      }

      this.startLoading();

      // Atualizar dados do usuário
      this.userService.update(userId, validatedData).subscribe({
        next: (response) => {
          this.user.set(response);

          // Atualizar endereço se preenchido
          if (this.addressForm.dirty && this.addressForm.valid) {
            this.updateUserAddress(userId);
          } else {
            this.showSuccess('Usuário atualizado com sucesso!');
            this.stopLoading();
          }
        },
        error: (error) => {
          this.showError('Erro ao atualizar usuário', error.message);
          this.stopLoading();
        },
      });
    } catch (error: any) {
      this.showError('Dados inválidos', error.message);
    }
  }

  /**
   * Atualiza o endereço do usuário.
   *
   * @param userId ID do usuário.
   */
  private updateUserAddress(userId: string): void {
    const addressData = this.addressForm.value;

    try {
      const validatedAddress = userAddressSchema.parse(addressData);

      this.userService
        .createOrUpdateAddress(userId, validatedAddress)
        .subscribe({
          next: () => {
            this.showSuccess('Usuário e endereço atualizados com sucesso!');
            this.stopLoading();
          },
          error: (error) => {
            this.showWarn(
              'Usuário atualizado, mas houve erro no endereço',
              error.message
            );
            this.stopLoading();
          },
        });
    } catch (error: any) {
      this.showWarn('Usuário atualizado, mas endereço possui dados inválidos');
      this.stopLoading();
    }
  }

  /**
   * Navega de volta para a lista de usuários.
   */
  public back(): void {
    this.goTo([AppRoutes.USERS]);
  }
}
