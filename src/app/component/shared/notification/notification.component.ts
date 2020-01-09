import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  Alert,
  NotificationService
} from "src/app/services/notification/notification.service";

@Component({
  selector: "app-notification",
  template: `
    <p *ngFor="let alert of alerts">
      <ngb-alert [type]="alert.type" (close)="close(alert)">
        {{ alert.message }}
      </ngb-alert>
    </p>
  `
})
export class NotificationComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<null>();
  alerts: Alert[];

  constructor(private notification: NotificationService) {}

  ngOnInit() {
    this.notification
      .getTrigger()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (alerts: Alert[]) => {
          this.alerts = alerts;
        },
        err => {
          this.alerts = [
            { type: "danger", message: "Notification system failure." }
          ];
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Close alert
   * @param alert Alert datatype
   */
  close(alert: Alert) {
    this.notification.clearAlert(this.alerts.indexOf(alert));
  }
}
