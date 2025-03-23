import { Injectable, Signal, signal, TemplateRef } from "@angular/core";

export type ToastVariant = "default" | "success" | "info" | "warning" | "danger";

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
  private readonly _toasts = signal<ToastInfo[]>([]);

  /**
   * A readonly signal that can be used to get all of the open toasts.
   * If you wish to open a toast, use the appropriate method on this class.
   *
   * This signal is readonly so that only this service can open new toasts.
   */
  public get toasts(): Signal<ToastInfo[]> {
    return this._toasts;
  }

  // We used to use a different library for toasts called "@services/toasts/toasts.service"
  // however, because we were already using ng-bootstrap, we decided to switch
  // to remove @services/toasts/toasts.service as a dependency.
  public show(message: string, title = "", options: ToastOptions = {}) {
    this._toasts.update((values) =>
      values.concat({ title, message, options, variant: "default" })
    );
  }

  public success(message: string, title = "", options: ToastOptions = {}) {
    this._toasts.update((values) =>
      values.concat({ title, message, options, variant: "success" })
    );
  }

  public error(message: string, title = "", options: ToastOptions = {}) {
    this._toasts.update((values) =>
      values.concat({ title, message, options, variant: "danger" })
    );
  }

  public info(message: string, title = "", options: ToastOptions = {}) {
    this._toasts.update((values) =>
      values.concat({ title, message, options, variant: "info" })
    );
  }

  public warning(message: string, title = "", options: ToastOptions = {}) {
    this._toasts.update((values) =>
      values.concat({ title, message, options, variant: "warning" })
    );
  }

  public remove(toast: ToastInfo) {
    this._toasts.update((t) => t.filter((value) => value !== toast));
  }

  public showToastInfo(toast: ToastInfo) {
    this._toasts.update((values) => values.concat(toast));
  }
}
