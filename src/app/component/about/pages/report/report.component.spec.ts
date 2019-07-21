import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutReportComponent } from './report.component';

describe('AboutReportComponent', () => {
  let component: AboutReportComponent;
  let fixture: ComponentFixture<AboutReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
