import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisStatisticsComponent } from './statistics.component';

describe('AnalysisStatisticsComponent', () => {
  let component: AnalysisStatisticsComponent;
  let fixture: ComponentFixture<AnalysisStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalysisStatisticsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
