import { TestBed } from '@angular/core/testing';

import { LayoutMenusService } from './layout-menus.service';

describe('LayoutMenusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LayoutMenusService = TestBed.get(LayoutMenusService);
    expect(service).toBeTruthy();
  });
});
