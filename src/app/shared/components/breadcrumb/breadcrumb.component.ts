// breadcrumb.component.ts
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService } from '../../services';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  private breadcrumbService = inject(BreadcrumbService);
  private router = inject(Router);

  readonly breadcrumbs = computed(() => {
    const items = this.breadcrumbService.breadcrumbs();
    return items.map(
      (item, index) =>
        ({
          label: item.label,
          icon: item.icon ? `pi pi-${item.icon}` : undefined,
          command: item.url
            ? () => this.router.navigateByUrl(item.url!)
            : undefined,
          disabled: index === items.length - 1, // Last item is disabled
        } as MenuItem)
    );
  });

  readonly home: MenuItem = {
    icon: 'pi pi-home',
    command: () => this.router.navigateByUrl('/dashboard'),
  };
}
