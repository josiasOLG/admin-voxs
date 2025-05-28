import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-toast-style',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: `app-toast.component.html`,
  styleUrls: ['./app-toast.component.scss'],
})
export class AppToastComponent {}
