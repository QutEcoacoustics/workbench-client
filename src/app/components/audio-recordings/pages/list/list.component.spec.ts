import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AudioRecordingsListComponent } from "./list.component";

// TODO
xdescribe("AudioRecordingsListComponent", () => {
  let component: AudioRecordingsListComponent;
  let fixture: ComponentFixture<AudioRecordingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioRecordingsListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioRecordingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
