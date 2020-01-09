import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  Alert,
  NotificationService
} from "src/app/services/notification/notification.service";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"]
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

  /**
   * Close alert
   * @param alert Alert datatype
   */
  close(alert: Alert) {
    this.notification.clearAlert(this.alerts.indexOf(alert));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
