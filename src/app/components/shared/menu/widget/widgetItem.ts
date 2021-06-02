import { Type } from "@angular/core";
import { PageInfo } from "@helpers/page/pageInfo";
import { NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent, WidgetComponent } from "./widget.component";

/**
 * Generic widget menu item
 */
export class WidgetMenuItem {
  public constructor(
    public component: Type<WidgetComponent>,
    public pageData: any
  ) {}

  /**
   * Assign data to the component
   *
   * @param component Component to assign data to
   */
  public assignComponentData(component: WidgetComponent): void {
    component.pageData = this.pageData;
  }
}

/**
 * Modal widget menu item
 */
export class ModalMenuItem {
  public constructor(
    public component: Type<ModalComponent>,
    public pageData: any,
    public modalOpts: NgbModalOptions = {}
  ) {
    this.modalOpts = {
      size: "lg",
      centered: true,
      scrollable: true,
      ...this.modalOpts,
    };
  }

  /**
   * Assign data to the component
   *
   * @param component Component to assign data to
   * @param routeData Route data to pass to modal
   * @param modalRef Reference to modal so we can interact with it
   */
  public assignComponentData(
    component: ModalComponent,
    routeData: PageInfo,
    modalRef: NgbModalRef
  ): void {
    Object.assign(component, {
      routeData,
      pageData: this.pageData,
      dismissModal: (reason: any) => modalRef.dismiss(reason),
      closeModal: (result: any) => modalRef.close(result),
    } as ModalComponent);
  }
}
