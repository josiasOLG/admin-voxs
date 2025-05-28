import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { LoadingService } from '../services/loading.service';
import { BaseResourceComponent } from './base-resource.component';

@Component({
  standalone: true,
  selector: 'app-test-base-resource',
  template: '',
})
class TestComponent extends BaseResourceComponent {}

describe('BaseResourceComponent', () => {
  let component: TestComponent;
  let routerMock: jest.Mocked<Router>;
  let toastMock: jest.Mocked<ToastService>;
  let loadingMock: jest.Mocked<LoadingService>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn().mockResolvedValue(true),
      url: '/current',
    } as any;

    toastMock = {
      success: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as any;

    loadingMock = {
      loading: false,
      show: jest.fn(),
      hide: jest.fn(),
    } as any;

    const activatedRouteMock: ActivatedRoute = {
      snapshot: {
        data: {
          title: 'Título',
          subtitle: 'Subtítulo',
          icon: 'icone',
          backLink: '/voltar',
        },
        params: { id: 1 },
        queryParams: { page: 2 },
        firstChild: {
          data: { childKey: 'filho' },
          firstChild: {
            data: { deepKey: 'profundo' },
            firstChild: null,
          },
        } as any,
      },
    } as any;

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ToastService, useValue: toastMock },
        { provide: LoadingService, useValue: loadingMock },
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should access route data', () => {
    expect(component.getRouteData('title')).toBe('Título');
    expect(component.getChildRouteData('childKey')).toBe('filho');
    expect(component.getDeepChildRouteData('deepKey')).toBe('profundo');
  });

  it('should set title and subtitle', () => {
    component.setTitle('Novo Título', 'Novo Sub');
    expect(component.title()).toBe('Novo Título');
    expect(component.subtitle()).toBe('Novo Sub');
  });

  it('should call navigation methods', async () => {
    await component.reloadCurrentRoute();
    expect(routerMock.navigateByUrl).toHaveBeenCalledTimes(2);
  });

  it('should show toast messages', () => {
    component.showSuccess('ok', 'detalhe');
    expect(toastMock.success).toHaveBeenCalledWith('ok', 'detalhe');

    component.showError('erro');
    expect(toastMock.error).toHaveBeenCalledWith('erro', undefined);

    component.showWarn('atenção');
    expect(toastMock.warn).toHaveBeenCalledWith('atenção', undefined);
  });

  it('should start and stop loading', () => {
    component.startLoading();
    expect(loadingMock.show).toHaveBeenCalled();

    component.stopLoading();
    expect(loadingMock.hide).toHaveBeenCalled();
  });

  it('should generate columns from object keys', () => {
    const model = { nome: 'a', idade: 1, status: true };
    const cols = component.generateDisplayedColumns(model, {
      exclude: ['idade'],
      includeActions: true,
    });
    expect(cols).toEqual(['nome', 'status', 'acoes']);
  });
});
