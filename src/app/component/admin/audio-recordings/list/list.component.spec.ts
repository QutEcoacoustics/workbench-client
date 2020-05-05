import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminAudioRecordingsComponent } from "./list.component";

describe("AdminAudioRecordingsComponent", () => {
  let component: AdminAudioRecordingsComponent;
  let fixture: ComponentFixture<AdminAudioRecordingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAudioRecordingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAudioRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
