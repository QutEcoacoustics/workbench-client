import { TestBed } from '@angular/core/testing';

import { ToastsService } from './toasts.service';

describe('ToastsService', () => {
  let service: ToastsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
