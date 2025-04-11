import { Type } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { MenuAction, UserCallback } from "@interfaces/menusInterfaces";
import { NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent, WidgetComponent } from "./widget.component";

/**
 * Generic widget menu item
 * TODO Rename to GenericWidget
 */
export class WidgetMenuItem {
  public constructor(
    /** Component to display */
    public component: Type<WidgetComponent>,
    /** Whether or not to show this link */
    public predicate?: UserCallback<boolean>,
    /** Options to be passed to the component */
    public options?: Record<string, unknown>,
  ) {}
}

/** Modal widget menu item */
export interface MenuModal extends Omit<MenuAction, "kind"> {
  kind: "MenuModal";
  component: Type<ModalComponent>;
  /** Options to be passed to the bootstrap modal service */
  modalOpts?: NgbModalOptions;
  /** Options to be passed to the modal component */
  options?: Record<string, unknown>;
  assignComponentData(component: ModalComponent, modalRef: NgbModalRef): void;
  successCallback?: (componentInstance?: PageComponent) => void;
}

/** Modal widget menu item without action function set */
export type MenuModalWithoutAction = Omit<MenuModal, "action">;

export function menuModal<T extends Omit<MenuModal, "kind" | "action" | "assignComponentData">>(
  item: T,
): MenuModal | MenuModalWithoutAction {
  return Object.assign(item, {
    kind: "MenuModal" as const,
    indentation: item.parent ? item.parent.indentation + 1 : 0,
    order: item.parent?.order ?? item.order,
    modalOpts: {
      size: "lg",
      centered: true,
      scrollable: true,
      ...item.modalOpts,
    },
    assignComponentData(component: ModalComponent, modalRef: NgbModalRef) {
      const defaultOpts: ModalComponent = {
        dismissModal: (reason: any) => modalRef.dismiss(reason),
        closeModal: (result: any) => modalRef.close(result),
        successCallback: item?.successCallback,
        ...item.options,
      };
      Object.assign(component, defaultOpts);
    },
  });
}

/**
 * Determines if a menu item is a modal
 *
 * @param item Menu item
 */
export function isMenuModal(item: any): item is MenuModal | MenuModalWithoutAction {
  return (item as MenuModal).kind === "MenuModal";
}
