import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminAudioRecordingComponent } from "./details.component";

describe("AdminAudioRecordingComponent", () => {
  let component: AdminAudioRecordingComponent;
  let fixture: ComponentFixture<AdminAudioRecordingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAudioRecordingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAudioRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
