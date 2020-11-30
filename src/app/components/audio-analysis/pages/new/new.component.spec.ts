import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NewAudioAnalysisComponent } from "./new.component";

xdescribe("NewAudioAnalysisComponent", () => {
  let component: NewAudioAnalysisComponent;
  let fixture: ComponentFixture<NewAudioAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewAudioAnalysisComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAudioAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
