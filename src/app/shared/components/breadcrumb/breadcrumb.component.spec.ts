import { TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from './breadcrumb.component';
import { ActivatedRoute, Router } from '@angular/router';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let routerMock: Router;

  beforeEach(() => {
    routerMock = {
      navigateByUrl: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { root: { children: [] } } },
        { provide: Router, useValue: routerMock },
      ],
    });

    const fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
  });

  it('should navigate to url when goTo is called', () => {
    const url = '/home';
    component.goTo(url);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(url);
  });
});
