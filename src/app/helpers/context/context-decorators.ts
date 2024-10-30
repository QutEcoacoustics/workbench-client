import { ChangeDetectorRef, ElementRef } from "@angular/core";
import { ContextRequestEvent, UnknownContext } from "./context";

export interface WithContext {
  elementRef: ElementRef;
  changeDetectorRef: ChangeDetectorRef;
  ngAfterViewInit?(): void;
}

/**
 * You can use this decorator to bind a context subscription to a class property.
 *
 * @example
 * ```ts
 * class MyComponent {
 *    @ContextSubscription("my-context")
 *    public handleContextChange(newValue) {
 *      console.debug({ newValue });
 *    }
 * }
 * ```
 */
export function ContextSubscription(token: UnknownContext) {
  return (target: WithContext, propertyKey: string) => {
    const originalNgAfterViewInit = target.ngAfterViewInit;

    target.ngAfterViewInit = function () {
      // invoke the original ngAfterViewInit method if it exists
      if (originalNgAfterViewInit) {
        originalNgAfterViewInit();
      }

      const handler = (...args: unknown[]) => {
        // call the original method with the correct context
        target[propertyKey].apply(this, args);

        // request a zone.js change detection cycle
        // we do this so that when a context change occurs, the Angular's zone
        // detection cycle is triggered
        this.changeDetectorRef.detectChanges();
      };

      const contextRequest = new ContextRequestEvent(token, handler, true);

      const element = this.elementRef.nativeElement;
      element.dispatchEvent(contextRequest);
    };
  };
}
