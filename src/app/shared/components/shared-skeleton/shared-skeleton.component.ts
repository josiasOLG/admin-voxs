import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-shared-skeleton',
  templateUrl: './shared-skeleton.component.html',
  styleUrls: ['./shared-skeleton.component.scss'],
  imports: [CommonModule],
})
export class SharedSkeletonComponent {
  @Input() public height = '24px';
  @Input() public width = '100%';
  @Input() public count = 1;
  @Input() public radius = '4px';
}
