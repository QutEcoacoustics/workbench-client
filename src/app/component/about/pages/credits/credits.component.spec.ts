import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCreditsComponent } from './credits.component';

describe('AboutCreditsComponent', () => {
  let component: AboutCreditsComponent;
  let fixture: ComponentFixture<AboutCreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutCreditsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
