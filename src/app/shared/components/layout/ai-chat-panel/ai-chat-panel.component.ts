import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { AiChatHeaderComponent } from './components/ai-chat-header';
import { AiChatInputComponent } from './components/ai-chat-input';
import { AiChatMessageComponent } from './components/ai-chat-message';
import { AiChatStateService } from './services';

/**
 * Componente principal do painel de chat AI
 * Painel fixo no lado direito da tela para assistência profissional
 */
@Component({
  selector: 'app-ai-chat-panel',
  standalone: true,
  imports: [
    CommonModule,
    AiChatHeaderComponent,
    AiChatMessageComponent,
    AiChatInputComponent,
    TooltipModule,
  ],
  templateUrl: './ai-chat-panel.component.html',
  styleUrls: ['./ai-chat-panel.component.scss'],
})
export class AiChatPanelComponent {
  public chatService = inject(AiChatStateService);

  private messagesContainer = viewChild<ElementRef>('messagesContainer');

  constructor() {
    /**
     * Effect para scroll automático quando novas mensagens chegam
     */
    effect(() => {
      const messages = this.chatService.messages();
      if (messages.length > 0) {
        this.scrollToBottom();
      }
    });
  }

  /**
   * Manipula o envio de mensagem
   *
   * @param message Mensagem a ser enviada
   */
  public handleSendMessage(message: string): void {
    this.chatService.sendMessage(message);
  }

  /**
   * Manipula a minimização do chat
   */
  public handleMinimize(): void {
    this.chatService.toggleMinimize();
  }

  /**
   * Manipula a expansão do chat
   */
  public handleExpand(): void {
    this.chatService.toggleMinimize();
  }

  /**
   * Manipula o fechamento do chat
   */
  public handleClose(): void {
    this.chatService.closeChat();
  }

  /**
   * Faz scroll automático para o final das mensagens
   */
  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.messagesContainer()?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
