import { Injectable } from "@angular/core";

export interface ToastInfo {
  title: string;
  message: string;
  delay?: number;
}

@Injectable()
export class ToastsService {
  public toasts: ToastInfo[] = [];

  // We used to use a different library for toasts called "ngx-toastr"
  // however, because we were already using ng-bootstrap, we decided to switch
  // to remove ngx-toastr as a dependency.
  //
  public show(message: string, title: string) {
    this.toasts.push({ title, message });
  }

  public success() {}

  public error() {}

  public info() {}

  public warning() {}

  public remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
