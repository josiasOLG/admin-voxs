import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Componente de input para o chat AI
 */
@Component({
  selector: 'app-ai-chat-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
  ],
  template: `
    <div class="ai-chat-input">
      <div class="input-container">
        <input
          type="text"
          pInputText
          [(ngModel)]="messageText"
          (keydown.enter)="handleSend()"
          placeholder="Digite sua mensagem..."
          class="message-input"
          [disabled]="isDisabled()"
        />

        <button
          pButton
          class="send-button"
          [disabled]="!messageText().trim() || isDisabled()"
          (click)="handleSend()"
          pTooltip="Enviar mensagem"
          tooltipPosition="top"
        >
          <i class="pi pi-send"></i>
        </button>
      </div>

      <div class="input-footer">
        <small class="input-hint">
          <i class="pi pi-info-circle"></i>
          Pressione Enter para enviar
        </small>
      </div>
    </div>
  `,
  styleUrls: ['./ai-chat-input.component.scss'],
})
export class AiChatInputComponent {
  public messageText = signal<string>('');
  public isDisabled = signal<boolean>(false);
  public sendMessage = output<string>();

  /**
   * Manipula o envio da mensagem
   */
  public handleSend(): void {
    const text = this.messageText().trim();
    if (text && !this.isDisabled()) {
      this.sendMessage.emit(text);
      this.messageText.set('');
    }
  }
}
