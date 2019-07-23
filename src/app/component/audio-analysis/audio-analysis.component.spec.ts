import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioAnalysisComponent } from './audio-analysis.component';

describe('AudioAnalysisComponent', () => {
  let component: AudioAnalysisComponent;
  let fixture: ComponentFixture<AudioAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AudioAnalysisComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
