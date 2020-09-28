import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCardsComponent } from './site-cards.component';

describe('SiteCardsComponent', () => {
  let component: SiteCardsComponent;
  let fixture: ComponentFixture<SiteCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
