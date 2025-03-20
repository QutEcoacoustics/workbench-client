import { Injectable, signal } from "@angular/core";

export interface ToastOptions {
  closeButton?: boolean;
  disableTimeOut?: boolean;
  tapToDismiss?: boolean;
  positionClass?: string;
  enableHtml?: boolean;
  preventDuplicates?: boolean;
  includeTitleDuplicates?: boolean;
  resetTimeoutOnDuplicate?: boolean;

  delay?: number;
  autoHide?: boolean;
}

export interface ToastInfo {
  title: string;
  message: string;
  variant: "default" | "primary" | "success" | "info" | "warning" | "danger";
  options?: ToastOptions;
}

@Injectable()
export class ToastsService {
  public toasts = signal<ToastInfo[]>([]);

  // We used to use a different library for toasts called "@services/toasts/toasts.service"
  // however, because we were already using ng-bootstrap, we decided to switch
  // to remove @services/toasts/toasts.service as a dependency.
  //
  public show(message: string, title = "", options: ToastOptions = {}) {
    this.toasts.update((values) =>
      values.concat({ title, message, options, variant: "default" })
    );
  }

  public success(message: string, title = "", options: ToastOptions = {}) {
    this.toasts.update((values) =>
      values.concat({ title, message, options, variant: "success" })
    );
  }

  public error(message: string, title = "", options: ToastOptions = {}) {
    this.toasts.update((values) =>
      values.concat({ title, message, options, variant: "danger" })
    );
  }

  public info(message: string, title = "", options: ToastOptions = {}) {
    this.toasts.update((values) =>
      values.concat({ title, message, options, variant: "info" })
    );
  }

  public warning(message: string, title = "", options: ToastOptions = {}) {
    this.toasts.update((values) =>
      values.concat({ title, message, options, variant: "warning" })
    );
  }

  public remove(toast: ToastInfo) {
    this.toasts.update((t) => t.filter((value) => value !== toast));
  }
}
