import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private messageService: MessageService) {}

  public show(
    type: 'success' | 'error' | 'warn',
    title: string,
    description?: string
  ) {
    this.messageService.add({
      severity: type,
      summary: title,
      detail: description,
      life: 4000,
    });
  }

  public success(title: string, description?: string) {
    this.show('success', title, description);
  }

  public error(title: string, description?: string) {
    this.show('error', title, description);
  }

  public warn(title: string, description?: string) {
    this.show('warn', title, description);
  }
}
