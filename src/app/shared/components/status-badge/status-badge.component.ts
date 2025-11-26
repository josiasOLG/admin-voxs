import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

export type StatusSeverity = 'success' | 'info' | 'warning' | 'danger' | 'secondary';

/**
 * Componente reutilizável para exibir badges de status.
 * Utiliza PrimeNG Tag para design consistente.
 * Segue padrões: Standalone, Signals, KISS.
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, TagModule],
  template: `
    <p-tag
      [value]="label()"
      [severity]="severity()"
      [rounded]="rounded()"
      [icon]="icon()"
      [styleClass]="styleClass()"
    />
  `,
})
export class StatusBadgeComponent {
  public label = input.required<string>();
  public severity = input<StatusSeverity>('info');
  public rounded = input<boolean>(false);
  public icon = input<string | undefined>(undefined);
  public styleClass = input<string>('');
}
