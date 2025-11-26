import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { IRightNavItem } from '../../right-nav-item.interface';

/**
 * Componente de item individual do menu lateral direito
 */
@Component({
  selector: 'app-right-nav-item',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  template: `
    <div
      class="right-nav-item"
      (click)="handleClick()"
      [pTooltip]="item().label"
      tooltipPosition="left"
    >
      <div class="item-icon">
        <i [class]="item().icon"></i>
      </div>
      <div class="item-label">{{ item().label }}</div>
      <div class="item-divider"></div>
    </div>
  `,
  styleUrls: ['./right-nav-item.component.scss'],
})
export class RightNavItemComponent {
  public item = input.required<IRightNavItem>();
  public itemClick = output<IRightNavItem>();

  /**
   * Manipula o clique no item
   */
  public handleClick(): void {
    this.itemClick.emit(this.item());
    if (this.item().action) {
      this.item().action!();
    }
  }
}
