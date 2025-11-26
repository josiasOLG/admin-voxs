import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Layout para a Landing Page
 * Layout simples sem sidebar/navbar
 */
@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="landing-layout">
      <router-outlet />
    </div>
  `,
  styles: [
    `
      .landing-layout {
        min-height: 100vh;
        overflow-x: hidden;
      }
    `,
  ],
})
export class LandingLayoutComponent {}
