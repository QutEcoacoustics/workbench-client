import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AudioAnalysesComponent } from "./list.component";

xdescribe("AudioAnalysesComponent", () => {
  let component: AudioAnalysesComponent;
  let fixture: ComponentFixture<AudioAnalysesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioAnalysesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioAnalysesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
