import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { lastValueFrom, take, toArray } from 'rxjs';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });

    service = TestBed.inject(LoadingService);
  });

  it('should initialize with loading = false', () => {
    expect(service.loading()).toBe(false);
  });

  it('should set loading = true when show() is called', () => {
    service.show();
    expect(service.loading()).toBe(true);
  });

  it('should set loading = false when hide() is called', () => {
    service.show();
    service.hide();
    expect(service.loading()).toBe(false);
  });

  it('should toggle loading value correctly', () => {
    expect(service.loading()).toBe(false);
    service.toggle();
    expect(service.loading()).toBe(true);
    service.toggle();
    expect(service.loading()).toBe(false);
  });

  xit('should emit values from loading$ observable', async () => {
    const emissions$ = service.loading$.pipe(take(3), toArray());

    // ativa os estados que disparam as emissões
    service.show();
    service.hide();

    const values = await lastValueFrom(emissions$);
    expect(values).toEqual([false, true, false]);
  });
});
