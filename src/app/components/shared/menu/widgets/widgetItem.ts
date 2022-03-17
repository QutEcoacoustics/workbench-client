import { Type } from "@angular/core";
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
    public predicate?: UserCallback<boolean>
  ) {}
}

/** Modal widget menu item */
export interface MenuModal extends Omit<MenuAction, "kind"> {
  kind: "MenuModal";
  component: Type<ModalComponent>;
  modalOpts: NgbModalOptions;
  assignComponentData(component: ModalComponent, modalRef: NgbModalRef): void;
}

/** Modal widget menu item without action function set */
export type MenuModalWithoutAction = Omit<MenuModal, "action">;

export function menuModal<
  T extends Omit<MenuModal, "kind" | "action" | "assignComponentData">
>(item: T): MenuModal | MenuModalWithoutAction {
  return Object.assign(item, {
    kind: "MenuModal" as const,
    indentation: 0,
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
export function isMenuModal(
  item: any
): item is MenuModal | MenuModalWithoutAction {
  return (item as MenuModal).kind === "MenuModal";
}
