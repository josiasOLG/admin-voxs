import { TestBed } from '@angular/core/testing';
import { SideNavComponent } from './side-nav.component';
import { Router } from '@angular/router';
import { IMenuItem } from './menu-itens';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let routerMock: Router;

  beforeEach(() => {
    routerMock = {
      navigateByUrl: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [SideNavComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    });

    const fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate using router if item.link is provided', () => {
    const item: IMenuItem = { label: 'Home', link: '/home' };
    component.handleClick(item);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('should call action if item.action is provided', () => {
    const actionMock = jest.fn();
    const item: IMenuItem = { label: 'Click', action: actionMock };
    component.handleClick(item);
    expect(actionMock).toHaveBeenCalled();
  });

  it('should toggle dropdown state', () => {
    const item: IMenuItem = { label: 'Dropdown' };
    expect(component.isDropdownOpen(item)).toBe(false);

    component.toggleDropdown(item);
    expect(component.isDropdownOpen(item)).toBe(true);

    component.toggleDropdown(item);
    expect(component.isDropdownOpen(item)).toBe(false);
  });
});
