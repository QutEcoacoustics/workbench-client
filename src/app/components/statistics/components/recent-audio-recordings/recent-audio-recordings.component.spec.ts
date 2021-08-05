import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RecentAudioRecordingsComponent } from "./recent-audio-recordings.component";

describe("RecentAudioRecordingsComponent", () => {
  let component: RecentAudioRecordingsComponent;
  let fixture: ComponentFixture<RecentAudioRecordingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentAudioRecordingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentAudioRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
