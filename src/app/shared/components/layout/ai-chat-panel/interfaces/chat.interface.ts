/**
 * Tipos de mensagem no chat
 */
export enum ChatMessageType {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

/**
 * Status da mensagem
 */
export enum ChatMessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  ERROR = 'error',
}

/**
 * Interface para mensagens do chat
 */
export interface IChatMessage {
  id: string;
  content: string;
  type: ChatMessageType;
  timestamp: Date;
  status?: ChatMessageStatus;
  avatar?: string;
}

/**
 * Interface para o estado do chat
 */
export interface IChatState {
  isOpen: boolean;
  isMinimized: boolean;
  isTyping: boolean;
  messages: IChatMessage[];
}
