import { CommonModule } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject } from "rxjs";
import {
  Alert,
  NotificationService
} from "src/app/services/notification/notification.service";
import { NotificationComponent } from "./notification.component";

describe("NotificationComponent", () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let service: NotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      imports: [CommonModule, NgbModule]
    }).compileComponents();

    service = TestBed.get(NotificationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should create with zero alerts", () => {
    fixture.detectChanges();
    const alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(0);
  });

  it("should create success alert", () => {
    fixture.detectChanges();
    service.success("test message");
    fixture.detectChanges();

    const alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(1);

    const successAlerts = fixture.nativeElement.querySelectorAll(
      "ngb-alert.alert-success"
    );
    expect(successAlerts.length).toBe(1);
    expect(successAlerts[0].innerText).toContain("test message");
  });

  it("should create warning alert", () => {
    fixture.detectChanges();
    service.warning("test message");
    fixture.detectChanges();

    const alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(1);

    const warningAlerts = fixture.nativeElement.querySelectorAll(
      "ngb-alert.alert-warning"
    );
    expect(warningAlerts.length).toBe(1);
    expect(warningAlerts[0].innerText).toContain("test message");
  });

  it("should create danger alert", () => {
    fixture.detectChanges();
    service.danger("test message");
    fixture.detectChanges();

    const alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(1);

    const dangerAlerts = fixture.nativeElement.querySelectorAll(
      "ngb-alert.alert-danger"
    );
    expect(dangerAlerts.length).toBe(1);
    expect(dangerAlerts[0].innerText).toContain("test message");
  });

  it("should create multiple alerts", () => {
    fixture.detectChanges();
    service.success("test message 1");
    service.warning("test message 2");
    service.danger("test message 3");
    fixture.detectChanges();

    const alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(3);
    expect(alerts[0].innerText).toContain("test message 3");
    expect(alerts[1].innerText).toContain("test message 2");
    expect(alerts[2].innerText).toContain("test message 1");
  });

  it("should destroy success alert", () => {
    fixture.detectChanges();
    service.success("test message");
    fixture.detectChanges();

    let alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    const alertButton = alerts[0].querySelector("button.close");
    alertButton.click();
    fixture.detectChanges();

    alerts = fixture.nativeElement.querySelectorAll("ngb-alert");

    expect(alerts.length).toBe(0);
  });

  it("should destroy warning alert", () => {
    fixture.detectChanges();
    service.warning("test message");
    fixture.detectChanges();

    let alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    const alertButton = alerts[0].querySelector("button.close");
    alertButton.click();
    fixture.detectChanges();

    alerts = fixture.nativeElement.querySelectorAll("ngb-alert");

    expect(alerts.length).toBe(0);
  });

  it("should destroy danger alert", () => {
    fixture.detectChanges();
    service.danger("test message");
    fixture.detectChanges();

    let alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    const alertButton = alerts[0].querySelector("button.close");
    alertButton.click();
    fixture.detectChanges();

    alerts = fixture.nativeElement.querySelectorAll("ngb-alert");

    expect(alerts.length).toBe(0);
  });

  it("should destroy multiple alerts", () => {
    fixture.detectChanges();
    service.success("test message");
    service.warning("test message");
    service.danger("test message");
    fixture.detectChanges();

    let alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    let alertButton = alerts[0].querySelector("button.close");
    alertButton.click();
    fixture.detectChanges();

    alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(2);
    alertButton = alerts[0].querySelector("button.close");
    alertButton.click();
    fixture.detectChanges();

    alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(1);
    alertButton = alerts[0].querySelector("button.close");
    alertButton.click();
    fixture.detectChanges();

    alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(0);
  });

  it("should destroy oldest alert", () => {
    fixture.detectChanges();
    service.success("test message 1");
    service.warning("test message 2");
    service.danger("test message 3");
    fixture.detectChanges();

    let alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    alerts[2].querySelector("button.close").click();
    fixture.detectChanges();

    alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(2);
    expect(alerts[0].innerText).toContain("test message 3");
    expect(alerts[1].innerText).toContain("test message 2");
  });

  it("should destroy random alert", () => {
    fixture.detectChanges();
    service.success("test message 1");
    service.warning("test message 2");
    service.danger("test message 3");
    fixture.detectChanges();

    let alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    alerts[1].querySelector("button.close").click();
    fixture.detectChanges();

    alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(2);
    expect(alerts[0].innerText).toContain("test message 3");
    expect(alerts[1].innerText).toContain("test message 1");
  });

  it("should destroy newest alert", () => {
    fixture.detectChanges();
    service.success("test message 1");
    service.warning("test message 2");
    service.danger("test message 3");
    fixture.detectChanges();

    let alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    alerts[0].querySelector("button.close").click();
    fixture.detectChanges();

    alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(2);
    expect(alerts[0].innerText).toContain("test message 2");
    expect(alerts[1].innerText).toContain("test message 1");
  });

  it("should handle notification trigger error", () => {
    spyOn(service, "getTrigger").and.callFake(() => {
      const subject = new BehaviorSubject<Alert[]>([]);

      subject.error("Error");

      return subject;
    });

    fixture.detectChanges();

    const alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(1);

    const alert = fixture.nativeElement.querySelector("ngb-alert.alert-danger");
    expect(alert).toBeTruthy();
    expect(alert.innerText).toContain("Notification system failure.");
  });
});
