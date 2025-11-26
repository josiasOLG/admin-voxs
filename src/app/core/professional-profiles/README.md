# Professional Profiles System

Sistema completo de perfis profissionais para o admin-voxs.

## 📁 Estrutura

```
professional-profiles/
├── enums/                      # Enumerações
│   ├── professional-type.enum.ts
│   ├── module-category.enum.ts
│   └── index.ts
├── interfaces/                 # Interfaces TypeScript
│   ├── terminology.interface.ts
│   ├── branding.interface.ts
│   ├── custom-field.interface.ts
│   ├── module-config.interface.ts
│   ├── settings.interface.ts
│   ├── regulation.interface.ts
│   ├── professional-profile.interface.ts
│   └── index.ts
├── templates/                  # Templates pré-configurados
│   ├── barber.template.ts
│   ├── psychologist.template.ts
│   ├── personal-trainer.template.ts
│   └── index.ts
├── services/                   # Services
│   ├── professional-profile.service.ts
│   └── index.ts
└── index.ts
```

## 🎯 Funcionalidades

### 1. Tipos de Profissionais Suportados

- ✅ Barbeiro/Cabeleireiro
- ✅ Psicólogo
- ✅ Personal Trainer
- ✅ Médico
- ✅ Advogado
- ✅ Designer
- ✅ Fotógrafo
- ✅ Arquiteto
- ✅ Professor Particular
- ✅ Terapeuta/Massagista
- ✅ Nutricionista
- ✅ Veterinário
- ✅ Dentista
- ✅ Personalizado

### 2. Configurações por Perfil

- **Branding**: Cores, logo, ícone, tema
- **Terminologia**: Adaptação de vocabulário (Cliente/Paciente/Aluno)
- **Módulos**: Habilitação/desabilitação de funcionalidades
- **Campos Customizados**: Adicionar campos específicos por entidade
- **Settings**: Duração de sessão, recorrência, pagamentos, etc
- **Regulamentação**: Conformidade com conselhos profissionais (CRM, CRP, CREF)

### 3. Service Principal

O `ProfessionalProfileService` oferece:

```typescript
// Carregar perfil
profileService.loadProfile(userId);

// Criar perfil de template
profileService.createProfileFromTemplate(ProfessionalType.BARBER, userId);

// Atualizar branding
profileService.updateBranding({ primaryColor: '#FF5722' });

// Gerenciar módulos
profileService.toggleModule('qrcode-loyalty', true);
profileService.updateModuleConfig('appointments', { priority: 1 });

// Campos customizados
profileService.addCustomField({ ... });
profileService.getCustomFieldsByEntity('client');

// Terminologia
profileService.getTerm('client', true); // "Clientes" ou "Pacientes"
```

### 4. Signals Reativos

O service usa Angular Signals para reatividade:

```typescript
const profile = profileService.currentProfile(); // Signal
const branding = profileService.branding(); // Computed
const terminology = profileService.terminology(); // Computed
const enabledModules = profileService.enabledModules(); // Computed
```

## 🔧 Uso

### Importar no módulo:

```typescript
import { ProfessionalProfileService } from "@core/professional-profiles";
```

### Em um componente:

```typescript
export class MyComponent {
  private profileService = inject(ProfessionalProfileService);

  // Acessar dados reativos
  branding = this.profileService.branding();
  clientTerm = this.profileService.getTerm("client");
}
```

## 📝 Próximos Passos

- [ ] Criar componentes UI para edição de perfil
- [ ] Implementar wizard de configuração inicial
- [ ] Adicionar validações de formulários
- [ ] Criar página de marketplace de módulos
- [ ] Implementar feature flags
