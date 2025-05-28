import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedSkeletonComponent } from './shared-skeleton.component';

describe('SharedSkeletonComponent', () => {
  let fixture: ComponentFixture<SharedSkeletonComponent>;
  let component: SharedSkeletonComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedSkeletonComponent],
    });

    fixture = TestBed.createComponent(SharedSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.height).toBe('24px');
    expect(component.width).toBe('100%');
    expect(component.count).toBe(1);
    expect(component.radius).toBe('4px');
  });

  it('should accept input overrides', () => {
    component.height = '40px';
    component.width = '80%';
    component.count = 3;
    component.radius = '8px';

    fixture.detectChanges();

    expect(component.height).toBe('40px');
    expect(component.width).toBe('80%');
    expect(component.count).toBe(3);
    expect(component.radius).toBe('8px');
  });
});
