import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLoadingComponent } from './shared/components/layout/app-loading/app-loading.component';
import { AppToastComponent } from './shared/components/layout/app-toast/app-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppLoadingComponent, AppToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
