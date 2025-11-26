import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * Componente de logo para o menu lateral direito
 */
@Component({
  selector: 'app-right-nav-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="right-nav-logo">
      <div class="logo-container">
        <i class="pi pi-chart-bar"></i>
      </div>
    </div>
  `,
  styleUrls: ['./right-nav-logo.component.scss'],
})
export class RightNavLogoComponent {}
