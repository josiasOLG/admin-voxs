import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ChatMessageType, IChatMessage } from '../../interfaces';

/**
 * Componente para exibir uma mensagem individual do chat
 */
@Component({
  selector: 'app-ai-chat-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="chat-message"
      [class.user-message]="message().type === messageTypes.USER"
      [class.ai-message]="message().type === messageTypes.AI"
      [class.system-message]="message().type === messageTypes.SYSTEM"
    >
      @if (message().type === messageTypes.AI) {
      <div class="message-avatar">
        <i class="pi pi-sparkles"></i>
      </div>
      }

      <div class="message-content">
        <div class="message-bubble">
          <p class="message-text">{{ message().content }}</p>
          <span class="message-time">
            {{ formatTime(message().timestamp) }}
          </span>
        </div>
      </div>

      @if (message().type === messageTypes.USER) {
      <div class="message-avatar user-avatar">
        <i class="pi pi-user"></i>
      </div>
      }
    </div>
  `,
  styleUrls: ['./ai-chat-message.component.scss'],
})
export class AiChatMessageComponent {
  public message = input.required<IChatMessage>();
  public messageTypes = ChatMessageType;

  /**
   * Formata o timestamp da mensagem
   *
   * @param date Data da mensagem
   * @returns Horário formatado
   */
  public formatTime(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
