import { Directive, ViewContainerRef, inject } from "@angular/core";

/**
 * Widget Directive for menu layouts.
 * Follows this guide: https://angular.io/guide/dynamic-component-loader
 */
@Directive({ selector: "[bawMenuWidget]" })
export class WidgetDirective {
  public readonly viewContainerRef = inject(ViewContainerRef);
}
