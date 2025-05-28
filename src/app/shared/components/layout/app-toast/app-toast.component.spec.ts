import { TestBed } from '@angular/core/testing';
import { AppToastComponent } from './app-toast.component';

describe('AppToastComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      imports: [AppToastComponent],
    });
    const fixture = TestBed.createComponent(AppToastComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
