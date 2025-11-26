import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';

import {
  ProfessionalProfileService,
  ProfessionalType,
  ProfessionalProfile,
} from '../index';

/**
 * Componente de demonstração do sistema de perfis profissionais.
 * Mostra como usar o ProfessionalProfileService e seus recursos.
 *
 * @example
 * <app-professional-profile-demo></app-professional-profile-demo>
 */
@Component({
  selector: 'app-professional-profile-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    ColorPickerModule,
    DividerModule,
    TableModule,
    TagModule,
    InputSwitchModule,
  ],
  template: `
    <div class="professional-profile-demo">
      <p-card header="Sistema de Perfis Profissionais - Demo">
        <!-- Seleção de Tipo de Profissional -->
        <div class="section">
          <h3>1. Selecionar Tipo de Profissional</h3>
          <div class="p-fluid">
            <p-dropdown
              [options]="professionalTypes"
              [(ngModel)]="selectedType"
              placeholder="Selecione o tipo de profissional"
              optionLabel="label"
              optionValue="value"
            ></p-dropdown>
            <p-button
              label="Criar Perfil do Template"
              icon="pi pi-plus"
              (onClick)="createProfileFromTemplate()"
              [disabled]="!selectedType"
              styleClass="p-mt-2"
            ></p-button>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Perfil Atual -->
        @if (currentProfile()) {
          <div class="section">
            <h3>2. Perfil Atual</h3>

            <!-- Branding -->
            <div class="branding-section">
              <h4>Branding</h4>
              <div class="p-grid p-fluid">
                <div class="p-col-12 p-md-6">
                  <label>Nome de Exibição</label>
                  <input pInputText [(ngModel)]="brandingName" />
                </div>
                <div class="p-col-12 p-md-3">
                  <label>Cor Primária</label>
                  <p-colorPicker [(ngModel)]="primaryColor"></p-colorPicker>
                </div>
                <div class="p-col-12 p-md-3">
                  <label>Cor Secundária</label>
                  <p-colorPicker [(ngModel)]="secondaryColor"></p-colorPicker>
                </div>
              </div>
              <p-button
                label="Atualizar Branding"
                icon="pi pi-save"
                (onClick)="updateBranding()"
                styleClass="p-mt-2"
              ></p-button>
            </div>

            <p-divider></p-divider>

            <!-- Terminologia -->
            <div class="terminology-section">
              <h4>Terminologia</h4>
              <div class="p-grid">
                <div class="p-col-3">
                  <strong>Cliente:</strong> {{ getTerm('client') }} / {{ getTerm('client', true) }}
                </div>
                <div class="p-col-3">
                  <strong>Serviço:</strong> {{ getTerm('service') }} / {{ getTerm('service', true) }}
                </div>
                <div class="p-col-3">
                  <strong>Agendamento:</strong> {{ getTerm('appointment') }} / {{ getTerm('appointment', true) }}
                </div>
                <div class="p-col-3">
                  <strong>Registro:</strong> {{ getTerm('record') }} / {{ getTerm('record', true) }}
                </div>
              </div>
            </div>

            <p-divider></p-divider>

            <!-- Módulos -->
            <div class="modules-section">
              <h4>Módulos Habilitados</h4>
              <p-table [value]="enabledModules()" [paginator]="true" [rows]="5">
                <ng-template pTemplate="header">
                  <tr>
                    <th>ID</th>
                    <th>Nome Customizado</th>
                    <th>Prioridade</th>
                    <th>Visível no Menu</th>
                    <th>Ações</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-module>
                  <tr>
                    <td>{{ module.moduleId }}</td>
                    <td>{{ module.customName || module.moduleId }}</td>
                    <td><p-tag [value]="module.priority"></p-tag></td>
                    <td>
                      <p-inputSwitch
                        [(ngModel)]="module.visibleInMenu"
                        (onChange)="updateModuleVisibility(module.moduleId, module.visibleInMenu)"
                      ></p-inputSwitch>
                    </td>
                    <td>
                      <p-button
                        icon="pi pi-times"
                        (onClick)="toggleModule(module.moduleId, false)"
                        [text]="true"
                        [rounded]="true"
                        severity="danger"
                      ></p-button>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>

            <p-divider></p-divider>

            <!-- Campos Customizados -->
            <div class="custom-fields-section">
              <h4>Campos Customizados por Entidade</h4>
              <div class="entity-selector">
                <p-dropdown
                  [options]="entities"
                  [(ngModel)]="selectedEntity"
                  placeholder="Selecione uma entidade"
                  optionLabel="label"
                  optionValue="value"
                ></p-dropdown>
              </div>
              @if (selectedEntity) {
                <p-table [value]="getCustomFieldsByEntity(selectedEntity)" styleClass="p-mt-2">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Obrigatório</th>
                      <th>Ordem</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-field>
                    <tr>
                      <td>{{ field.name }}</td>
                      <td><p-tag [value]="field.type"></p-tag></td>
                      <td>
                        <i class="pi" [class.pi-check]="field.required" [class.pi-times]="!field.required"></i>
                      </td>
                      <td>{{ field.order }}</td>
                    </tr>
                  </ng-template>
                </p-table>
              }
            </div>
          </div>
        } @else {
          <div class="empty-state">
            <i class="pi pi-user-plus" style="font-size: 3rem; color: var(--surface-400);"></i>
            <p>Nenhum perfil carregado. Selecione um tipo de profissional para começar.</p>
          </div>
        }
      </p-card>
    </div>
  `,
  styles: [`
    .professional-profile-demo {
      padding: 2rem;
    }

    .section {
      margin-bottom: 2rem;
    }

    .section h3 {
      margin-bottom: 1rem;
      color: var(--primary-color);
    }

    .section h4 {
      margin-bottom: 0.5rem;
      color: var(--text-color-secondary);
    }

    .branding-section,
    .terminology-section,
    .modules-section,
    .custom-fields-section {
      margin-top: 1rem;
    }

    .entity-selector {
      margin-bottom: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-color-secondary);
    }

    .empty-state p {
      margin-top: 1rem;
    }

    :host ::ng-deep {
      .p-colorpicker-preview {
        width: 3rem;
        height: 3rem;
      }
    }
  `],
})
export class ProfessionalProfileDemoComponent implements OnInit {
  private profileService = inject(ProfessionalProfileService);

  // Signals
  currentProfile = this.profileService.currentProfile;
  enabledModules = this.profileService.enabledModules;

  // Component state
  selectedType = signal<ProfessionalType | null>(null);
  selectedEntity = signal<string>('client');
  brandingName = signal<string>('');
  primaryColor = signal<string>('#1976D2');
  secondaryColor = signal<string>('#FFC107');

  // Options
  professionalTypes = Object.values(ProfessionalType).map(type => ({
    label: this.formatProfessionalType(type),
    value: type,
  }));

  entities = [
    { label: 'Clientes', value: 'client' },
    { label: 'Serviços', value: 'service' },
    { label: 'Agendamentos', value: 'appointment' },
    { label: 'Registros', value: 'record' },
  ];

  ngOnInit(): void {
    // Carregar valores iniciais se houver perfil
    const profile = this.currentProfile();
    if (profile) {
      this.brandingName.set(profile.branding.displayName);
      this.primaryColor.set(profile.branding.primaryColor);
      this.secondaryColor.set(profile.branding.secondaryColor);
    }
  }

  createProfileFromTemplate(): void {
    const type = this.selectedType();
    if (!type) return;

    const userId = 'demo-user-123'; // Em produção, pegar do auth
    this.profileService.createProfileFromTemplate(type, userId).subscribe({
      next: () => {
        console.log('Perfil criado com sucesso!');
        this.loadBrandingValues();
      },
      error: error => console.error('Erro ao criar perfil:', error),
    });
  }

  updateBranding(): void {
    this.profileService
      .updateBranding({
        displayName: this.brandingName(),
        primaryColor: this.primaryColor(),
        secondaryColor: this.secondaryColor(),
      })
      .subscribe({
        next: () => console.log('Branding atualizado!'),
        error: error => console.error('Erro ao atualizar branding:', error),
      });
  }

  getTerm(key: keyof ProfessionalProfile['terminology'], plural = false): string {
    return this.profileService.getTerm(key, plural);
  }

  toggleModule(moduleId: string, enabled: boolean): void {
    this.profileService.toggleModule(moduleId, enabled).subscribe({
      next: () => console.log(`Módulo ${moduleId} ${enabled ? 'habilitado' : 'desabilitado'}`),
      error: error => console.error('Erro ao alterar módulo:', error),
    });
  }

  updateModuleVisibility(moduleId: string, visible: boolean): void {
    this.profileService.updateModuleConfig(moduleId, { visibleInMenu: visible }).subscribe();
  }

  getCustomFieldsByEntity(entity: string) {
    return this.profileService.getCustomFieldsByEntity(entity);
  }

  private loadBrandingValues(): void {
    const profile = this.currentProfile();
    if (profile) {
      this.brandingName.set(profile.branding.displayName);
      this.primaryColor.set(profile.branding.primaryColor);
      this.secondaryColor.set(profile.branding.secondaryColor);
    }
  }

  private formatProfessionalType(type: ProfessionalType): string {
    const labels: Record<ProfessionalType, string> = {
      [ProfessionalType.BARBER]: 'Barbeiro/Cabeleireiro',
      [ProfessionalType.PSYCHOLOGIST]: 'Psicólogo',
      [ProfessionalType.PERSONAL_TRAINER]: 'Personal Trainer',
      [ProfessionalType.DOCTOR]: 'Médico',
      [ProfessionalType.LAWYER]: 'Advogado',
      [ProfessionalType.DESIGNER]: 'Designer',
      [ProfessionalType.PHOTOGRAPHER]: 'Fotógrafo',
      [ProfessionalType.ARCHITECT]: 'Arquiteto',
      [ProfessionalType.TUTOR]: 'Professor Particular',
      [ProfessionalType.THERAPIST]: 'Terapeuta/Massagista',
      [ProfessionalType.NUTRITIONIST]: 'Nutricionista',
      [ProfessionalType.VETERINARIAN]: 'Veterinário',
      [ProfessionalType.DENTIST]: 'Dentista',
      [ProfessionalType.CUSTOM]: 'Personalizado',
    };
    return labels[type] || type;
  }
}
