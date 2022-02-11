import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DownloadAudioRecordingsComponent } from "./download.component";

// TODO
xdescribe("DownloadAudioRecordingsComponent", () => {
  let component: DownloadAudioRecordingsComponent;
  let fixture: ComponentFixture<DownloadAudioRecordingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadAudioRecordingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAudioRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
