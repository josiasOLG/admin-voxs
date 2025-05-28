import { Directive, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { LoadingService } from '../services/loading.service';
import {
  BreadcrumbService,
  BreadcrumbItem,
} from '../services/breadcrumb.service'; // ajuste o caminho se necessário

@Directive()
export abstract class BaseResourceComponent {
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly toast = inject(ToastService);
  protected readonly loadingService = inject(LoadingService);
  protected readonly breadcrumbService = inject(BreadcrumbService); // ✅ injeção

  readonly isLoading = this.loadingService.loading;

  readonly title = signal(this.route.snapshot.data?.['title'] ?? '');
  readonly subtitle = signal(this.route.snapshot.data?.['subtitle'] ?? '');
  readonly icon = signal(this.route.snapshot.data?.['icon'] ?? '');
  readonly backLink = signal(this.route.snapshot.data?.['backLink'] ?? null);

  readonly routeParams = signal(this.route.snapshot.params);
  readonly queryParams = signal(this.route.snapshot.queryParams);

  protected setTitle(newTitle: string, newSubtitle?: string) {
    this.title.set(newTitle);
    if (newSubtitle) this.subtitle.set(newSubtitle);
  }

  protected setBreadcrumb(items: BreadcrumbItem[]) {
    this.breadcrumbService.set(items);
  }

  protected goTo(path: string | string[], extras: any = {}): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }

  protected goBack(): void {
    const back = this.backLink();
    if (back) this.goTo(back);
    else this.router.navigate(['../'], { relativeTo: this.route });
  }

  protected backViewlink(viewLink: string): void {
    this.router.navigate([viewLink], { relativeTo: this.route });
  }

  protected reloadCurrentRoute(): void {
    const url = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(url);
    });
  }

  protected showSuccess(msg: string, desc?: string) {
    this.toast.success(msg, desc);
  }

  protected showError(msg: string, desc?: string) {
    this.toast.error(msg, desc);
  }

  protected showWarn(msg: string, desc?: string) {
    this.toast.warn(msg, desc);
  }

  protected startLoading() {
    this.loadingService.show();
  }

  protected stopLoading() {
    this.loadingService.hide();
  }

  protected generateDisplayedColumns<T extends Record<string, any>>(
    model: T,
    options?: { exclude?: (keyof T)[]; includeActions?: boolean }
  ): string[] {
    const exclude = options?.exclude ?? [];

    const keys = Object.keys(model).filter(
      (key) => !exclude.includes(key as keyof T)
    );

    if (options?.includeActions) {
      keys.push('acoes');
    }

    return keys;
  }

  protected getRouteData<T = any>(key: string): T | null {
    return this.route.snapshot.data?.[key] ?? null;
  }

  protected getChildRouteData<T = any>(key: string): T | null {
    return this.route.snapshot.firstChild?.data?.[key] ?? null;
  }

  protected getDeepChildRouteData<T = any>(key: string): T | null {
    let current = this.route.snapshot.firstChild;
    while (current) {
      if (key in current.data) return current.data[key] as T;
      current = current.firstChild!;
    }
    return null;
  }
}
