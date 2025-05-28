import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { IMenuItem, MENU_ITEMS } from './menu-itens';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PanelMenuModule,
    AvatarModule,
    ButtonModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  public menuItems: MenuItem[] = [];

  constructor(private router: Router) {
    this.buildMenuItems();
  }

  private buildMenuItems(): void {
    this.menuItems = MENU_ITEMS.filter((item) => !item.section).map((item) => ({
      label: item.label,
      icon: `pi pi-${this.mapIcon(item.icon)}`,
      command: () => this.handleClick(item),
      routerLink: item.link,
    }));
  }

  private mapIcon(materialIcon?: string): string {
    const iconMap: { [key: string]: string } = {
      dashboard: 'chart-line',
      directions_car: 'car',
      home: 'home',
    };
    return iconMap[materialIcon || ''] || 'circle';
  }

  public handleClick(item: IMenuItem): void {
    if (item.action) {
      item.action();
    } else if (item.link) {
      this.router.navigateByUrl(item.link);
    }
  }
}
