import { Injectable, signal, TemplateRef } from "@angular/core";

export type ToastVariant = "default" | "primary" | "success" | "info" | "warning" | "danger";

export interface ToastOptions {
  delay?: number;
  autoHide?: boolean;
}

export interface ToastInfo {
  title: string;
  message: TemplateRef<unknown> | string;
  variant: ToastVariant;
  options?: ToastOptions;
}

@Injectable({ providedIn: "root" })
export class ToastService {
  public toasts = signal<ToastInfo[]>([]);

  // We used to use a different library for toasts called "@services/toasts/toasts.service"
  // however, because we were already using ng-bootstrap, we decided to switch
  // to remove @services/toasts/toasts.service as a dependency.
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

  public showToastInfo(toast: ToastInfo) {
    this.toasts.update((values) => values.concat(toast));
  }
}
