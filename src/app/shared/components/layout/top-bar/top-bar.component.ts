import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { BreadcrumbComponent } from '../../breadcrumb';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, BreadcrumbComponent],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {}
