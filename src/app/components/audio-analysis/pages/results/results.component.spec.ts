import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AudioAnalysisResultsComponent } from "./results.component";

xdescribe("AudioAnalysisResultsComponent", () => {
  let component: AudioAnalysisResultsComponent;
  let fixture: ComponentFixture<AudioAnalysisResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioAnalysisResultsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioAnalysisResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
