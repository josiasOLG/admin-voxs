import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideNavComponent, TopBarComponent],
  template: `
    <div class="layout-wrapper">
      <div class="layout-sidebar">
        <app-side-nav />
      </div>

      <div class="layout-main">
        <app-top-bar />

        <main class="layout-content p-3 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {}
