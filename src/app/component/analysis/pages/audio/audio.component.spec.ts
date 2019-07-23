import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisAudioComponent } from './audio.component';

describe('AnalysisAudioComponent', () => {
  let component: AnalysisAudioComponent;
  let fixture: ComponentFixture<AnalysisAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalysisAudioComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
