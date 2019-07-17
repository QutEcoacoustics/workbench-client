import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisSubmitComponent } from './submit.component';

describe('SubmitComponent', () => {
  let component: AnalysisSubmitComponent;
  let fixture: ComponentFixture<AnalysisSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalysisSubmitComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
