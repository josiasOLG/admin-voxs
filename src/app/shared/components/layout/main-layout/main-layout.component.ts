import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiChatPanelComponent, AiChatStateService } from '../ai-chat-panel';
import { RightNavComponent, RightNavStateService } from '../right-nav';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SideNavComponent,
    TopBarComponent,
    RightNavComponent,
    AiChatPanelComponent,
  ],
  template: `
    <div class="layout-wrapper">
      <div class="layout-right-sidebar">
        <app-right-nav />
      </div>

      @if (showSideNav()) {
      <div class="layout-sidebar">
        <app-side-nav />
      </div>
      }

      <div
        class="layout-main"
        [class.no-sidebar]="!showSideNav()"
        [class.chat-minimized]="isChatMinimized()"
      >
        <app-top-bar />

        <main class="layout-content p-3 overflow-auto">
          <router-outlet />
        </main>
      </div>

      <div class="layout-ai-chat" [class.minimized]="isChatMinimized()">
        <app-ai-chat-panel />
      </div>
    </div>
  `,
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  private rightNavStateService = inject(RightNavStateService);
  private aiChatStateService = inject(AiChatStateService);

  /**
   * Computed signal para determinar se o side-nav deve ser exibido
   */
  public readonly showSideNav = computed(() =>
    this.rightNavStateService.isRightNavContentActive()
  );

  /**
   * Computed signal para determinar se o chat está minimizado
   */
  public readonly isChatMinimized = computed(() =>
    this.aiChatStateService.isMinimized()
  );
}
