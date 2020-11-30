import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AudioAnalysisComponent } from "./details.component";

xdescribe("AudioAnalysisComponent", () => {
  let component: AudioAnalysisComponent;
  let fixture: ComponentFixture<AudioAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioAnalysisComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
