import { computed, Injectable, signal } from '@angular/core';
import {
  ChatMessageStatus,
  ChatMessageType,
  IChatMessage,
  IChatState,
} from '../interfaces';

/**
 * Service para gerenciar o estado do chat AI
 * Usa signals do Angular 19 para reatividade
 */
@Injectable({
  providedIn: 'root',
})
export class AiChatStateService {
  private _isOpen = signal<boolean>(true);
  private _isMinimized = signal<boolean>(false);
  private _isTyping = signal<boolean>(false);
  private _messages = signal<IChatMessage[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente virtual. Como posso ajudá-lo hoje?',
      type: ChatMessageType.AI,
      timestamp: new Date(),
      status: ChatMessageStatus.SENT,
    },
  ]);

  /**
   * Estado de abertura do chat
   */
  public readonly isOpen = this._isOpen.asReadonly();

  /**
   * Estado de minimização do chat
   */
  public readonly isMinimized = this._isMinimized.asReadonly();

  /**
   * Indica se a IA está digitando
   */
  public readonly isTyping = this._isTyping.asReadonly();

  /**
   * Lista de mensagens do chat
   */
  public readonly messages = this._messages.asReadonly();

  /**
   * Estado completo do chat (computed)
   */
  public readonly chatState = computed<IChatState>(() => ({
    isOpen: this._isOpen(),
    isMinimized: this._isMinimized(),
    isTyping: this._isTyping(),
    messages: this._messages(),
  }));

  /**
   * Contador de mensagens não lidas (computed)
   */
  public readonly unreadCount = computed<number>(() => {
    // Aqui você pode implementar lógica de contagem de não lidas
    return 0;
  });

  /**
   * Abre o chat
   */
  public openChat(): void {
    this._isOpen.set(true);
    this._isMinimized.set(false);
  }

  /**
   * Fecha o chat
   */
  public closeChat(): void {
    this._isOpen.set(false);
  }

  /**
   * Alterna entre aberto/fechado
   */
  public toggleChat(): void {
    this._isOpen.update((value) => !value);
    if (this._isOpen()) {
      this._isMinimized.set(false);
    }
  }

  /**
   * Minimiza/Maximiza o chat
   */
  public toggleMinimize(): void {
    this._isMinimized.update((value) => !value);
  }

  /**
   * Envia uma mensagem do usuário
   *
   * @param content Conteúdo da mensagem
   */
  public sendMessage(content: string): void {
    if (!content.trim()) return;

    const userMessage: IChatMessage = {
      id: this.generateId(),
      content: content.trim(),
      type: ChatMessageType.USER,
      timestamp: new Date(),
      status: ChatMessageStatus.SENT,
    };

    this._messages.update((messages) => [...messages, userMessage]);

    // Simula resposta da IA após 1.5s
    this._isTyping.set(true);
    setTimeout(() => {
      this.simulateAiResponse(content);
    }, 1500);
  }

  /**
   * Simula uma resposta da IA (substituir por chamada real à API)
   *
   * @param userMessage Mensagem do usuário
   */
  private simulateAiResponse(userMessage: string): void {
    const aiMessage: IChatMessage = {
      id: this.generateId(),
      content: this.generateAiResponse(userMessage),
      type: ChatMessageType.AI,
      timestamp: new Date(),
      status: ChatMessageStatus.SENT,
    };

    this._isTyping.set(false);
    this._messages.update((messages) => [...messages, aiMessage]);
  }

  /**
   * Gera uma resposta da IA (mock - substituir por integração real)
   *
   * @param userMessage Mensagem do usuário
   * @returns Resposta da IA
   */
  private generateAiResponse(userMessage: string): string {
    const responses = [
      'Entendi sua solicitação. Deixe-me ajudá-lo com isso.',
      'Ótima pergunta! Vou buscar as informações para você.',
      'Claro! Posso ajudá-lo com isso. Vou processar sua solicitação.',
      'Interessante! Vamos resolver isso juntos.',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Limpa o histórico de mensagens
   */
  public clearMessages(): void {
    this._messages.set([
      {
        id: '1',
        content: 'Olá! Sou seu assistente virtual. Como posso ajudá-lo hoje?',
        type: ChatMessageType.AI,
        timestamp: new Date(),
        status: ChatMessageStatus.SENT,
      },
    ]);
  }

  /**
   * Gera um ID único para mensagens
   *
   * @returns ID único
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
