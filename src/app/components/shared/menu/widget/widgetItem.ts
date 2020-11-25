import { Type } from "@angular/core";

/**
 * Widget menu item
 */
export class WidgetMenuItem {
  public constructor(public component: Type<any>, public pageData: any) {}
}
