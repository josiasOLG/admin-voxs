import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Componente de cabeçalho do chat AI
 */
@Component({
  selector: 'app-ai-chat-header',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  template: `
    <div class="ai-chat-header">
      <div class="header-content">
        <div class="ai-avatar">
          <i class="pi pi-sparkles"></i>
        </div>
        <div class="header-info">
          <h3 class="header-title">Assistente AI</h3>
          <span class="header-status">Online</span>
        </div>
      </div>

      <div class="header-actions">
        <button
          class="action-button"
          (click)="onMinimize()"
          pTooltip="Minimizar"
          tooltipPosition="bottom"
        >
          <i class="pi pi-window-minimize"></i>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./ai-chat-header.component.scss'],
})
export class AiChatHeaderComponent {
  public minimize = output<void>();
  public close = output<void>();

  /**
   * Emite evento de minimizar
   */
  public onMinimize(): void {
    this.minimize.emit();
  }

  /**
   * Emite evento de fechar
   */
  public onClose(): void {
    this.close.emit();
  }
}
