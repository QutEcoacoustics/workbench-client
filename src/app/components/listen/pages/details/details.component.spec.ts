import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ListenRecordingComponent } from "./details.component";

xdescribe("ListenRecordingComponent", () => {
  let component: ListenRecordingComponent;
  let fixture: ComponentFixture<ListenRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListenRecordingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListenRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
