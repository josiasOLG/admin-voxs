import { TestBed } from '@angular/core/testing';
import { AppLoadingComponent } from './app-loading.component';
import { LoadingService } from '../../../services';

describe('AppLoadingComponent', () => {
  let component: AppLoadingComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppLoadingComponent],
      providers: [
        {
          provide: LoadingService,
          useValue: {
            loading: jest.fn(() => true),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(AppLoadingComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
