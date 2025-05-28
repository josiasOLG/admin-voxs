import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _loading = signal<boolean>(false);

  loading = this._loading.asReadonly();
  loading$ = toObservable(this._loading);

  public show(): void {
    this._loading.set(true);
  }

  public hide(): void {
    this._loading.set(false);
  }

  public toggle(): void {
    this._loading.set(!this._loading());
  }
}
