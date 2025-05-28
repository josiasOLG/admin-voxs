import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../../services';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './app-loading.component.html',
})
export class AppLoadingComponent {
  private loadingService = inject(LoadingService);
  visible = signal(false);

  constructor() {
    effect(() => {
      this.visible.set(this.loadingService.loading());
    });
  }
}
