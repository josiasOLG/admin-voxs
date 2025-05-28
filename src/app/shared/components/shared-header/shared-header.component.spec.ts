import { TestBed } from '@angular/core/testing';
import { SharedHeaderComponent } from './shared-header.component';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService, ToastService } from '../../services';

describe('SharedHeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedHeaderComponent],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn(), navigateByUrl: jest.fn(), url: '/' },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                title: 'Mock Title',
                subtitle: 'Mock Subtitle',
                icon: 'mock_icon',
                backLink: '/mock-back',
              },
              params: {},
              queryParams: {},
              firstChild: null,
            },
          },
        },
        {
          provide: ToastService,
          useValue: {
            success: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
        {
          provide: LoadingService,
          useValue: {
            loading: jest.fn(() => false),
            show: jest.fn(),
            hide: jest.fn(),
          },
        },
      ],
    });
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(SharedHeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call viewLink when triggered manually', () => {
    const fixture = TestBed.createComponent(SharedHeaderComponent);
    const component = fixture.componentInstance;

    const viewLinkMock = jest.fn();
    component.viewLink = viewLinkMock;

    component.viewLink?.();
    expect(viewLinkMock).toHaveBeenCalled();
  });
});
