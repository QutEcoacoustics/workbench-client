import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NotificationComponent } from "./notification.component";

describe("NotificationComponent", () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  xit("should create with zero alerts", () => {});
  xit("should update with new alert", () => {});
  xit("should update multiple times", () => {});
  xit("should create success alert", () => {});
  xit("should create warning alert", () => {});
  xit("should create danger alert", () => {});
  xit("should create multiple alerts", () => {});
  xit("should destroy success alert", () => {});
  xit("should destroy warning alert", () => {});
  xit("should destroy danger alert", () => {});
  xit("should destroy multiple alerts", () => {});
});
