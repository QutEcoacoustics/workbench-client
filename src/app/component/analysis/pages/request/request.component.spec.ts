import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisRequestComponent } from './request.component';

describe('RequestComponent', () => {
  let component: AnalysisRequestComponent;
  let fixture: ComponentFixture<AnalysisRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalysisRequestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
