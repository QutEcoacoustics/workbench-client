import { CommonModule } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NotificationService } from "src/app/services/notification/notification.service";
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
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create with zero alerts", () => {
    const alerts = fixture.nativeElement.querySelectorAll("ngb-alert");
    expect(alerts.length).toBe(0);
  });

  it("should create success alert", () => {
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
});
