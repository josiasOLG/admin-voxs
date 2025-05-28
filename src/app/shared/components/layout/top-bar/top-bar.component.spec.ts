import { TestBed } from '@angular/core/testing';
import { TopBarComponent } from './top-bar.component';
import { ActivatedRoute, Router } from '@angular/router';

describe('TopBarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TopBarComponent],
      providers: [
        // Necessário porque BreadcrumbComponent usa inject(ActivatedRoute/Router)
        { provide: ActivatedRoute, useValue: { root: { children: [] } } },
        { provide: Router, useValue: { navigateByUrl: jest.fn() } },
      ],
    });
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(TopBarComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
