import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { BaseResourceComponent } from '../base-resource.component';
import { BreadcrumbComponent } from '../breadcrumb';

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToolbarModule,
    TooltipModule,
    BreadcrumbComponent,
  ],
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
})
export class SharedHeaderComponent extends BaseResourceComponent {
  @Input() iconInput?: string;
  @Input() showBackButton?: boolean = false;
  @Input() backAction?: () => void;
  @Input() viewLink?: () => void;
}
