import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  private alerts: Alert[];
  private trigger: BehaviorSubject<Alert[]>;

  constructor() {
    this.alerts = [];
    this.trigger = new BehaviorSubject<Alert[]>(this.alerts);
  }

  /**
   * Add a success alert to the notification system
   * @param message Message to display
   */
  public success(message: string) {
    this.addAlert("success", message);
  }

  /**
   * Add a warning alert to the notification system
   * @param message Message to display
   */
  public warning(message: string) {
    this.addAlert("warning", message);
  }

  /**
   * Add a danger alert to the notification system
   * @param message Message to display
   */
  public danger(message: string) {
    this.addAlert("danger", message);
  }

  /**
   * Clear alert from list
   * @param index Alert index
   */
  public clearAlert(index: number) {
    if (index < this.alerts.length) {
      this.alerts.splice(index, 1);
    }
  }

  /**
   * Returns the notification trigger
   */
  public getTrigger(): BehaviorSubject<Alert[]> {
    return this.trigger;
  }

  /**
   * Add an alert to the notification system
   * @param type Alert type
   * @param message Message to display
   */
  private addAlert(type: "success" | "warning" | "danger", message: string) {
    // Push to list and trigger update
    this.alerts.push({ type, message });
    this.trigger.next(this.alerts);
  }
}

/**
 * Notification alert details
 */
export interface Alert {
  type: "success" | "warning" | "danger";
  message: string;
}
