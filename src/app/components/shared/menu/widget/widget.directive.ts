import { Directive, ViewContainerRef } from "@angular/core";

/**
 * Widget Directive for menu layouts.
 * Follows this guide: https://angular.io/guide/dynamic-component-loader
 */
@Directive({
  selector: "[bawMenuWidget]",
})
export class WidgetDirective {
  public constructor(public viewContainerRef: ViewContainerRef) {}
}
