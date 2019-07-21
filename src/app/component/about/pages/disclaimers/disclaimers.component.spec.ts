import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDisclaimersComponent } from './disclaimers.component';

describe('AboutDisclaimersComponent', () => {
  let component: AboutDisclaimersComponent;
  let fixture: ComponentFixture<AboutDisclaimersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutDisclaimersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDisclaimersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
