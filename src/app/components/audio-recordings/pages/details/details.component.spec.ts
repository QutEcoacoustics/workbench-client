import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AudioRecordingsDetailsComponent } from "./details.component";

// TODO
xdescribe("AudioRecordingsDetailsComponent", () => {
  let component: AudioRecordingsDetailsComponent;
  let fixture: ComponentFixture<AudioRecordingsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioRecordingsDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioRecordingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
