import { Type } from "@angular/core";

/**
 * Widget menu item
 */
export class WidgetMenuItem {
  constructor(public component: Type<any>, public pageData: any) {}
}
