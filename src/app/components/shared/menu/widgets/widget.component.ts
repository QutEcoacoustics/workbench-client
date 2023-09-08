/** Generic widget component */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WidgetComponent {}

/** Modal widget component */
export interface ModalComponent extends WidgetComponent {
  closeModal: (result: any) => void;
  dismissModal?: (reason: any) => void;
  successCallback?: () => void;
  options?: Record<string, unknown>;
}
