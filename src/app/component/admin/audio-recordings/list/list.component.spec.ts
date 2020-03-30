import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminAudioRecordingsListComponent } from "./list.component";

xdescribe("AdminAudioRecordingsListComponent", () => {
  let component: AdminAudioRecordingsListComponent;
  let fixture: ComponentFixture<AdminAudioRecordingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAudioRecordingsListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAudioRecordingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
