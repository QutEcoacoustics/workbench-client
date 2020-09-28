import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionCardsComponent } from './region-cards.component';

describe('RegionCardsComponent', () => {
  let component: RegionCardsComponent;
  let fixture: ComponentFixture<RegionCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
