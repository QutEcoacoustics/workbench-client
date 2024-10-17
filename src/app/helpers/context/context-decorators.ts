import { ContextRequestEvent, UnknownContext } from "./context";

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
export function ContextHandler(token: UnknownContext) {
  return (target: any, propertyKey: string) => {
    const originalNgAfterViewInit = target.ngAfterViewInit;

    target.ngAfterViewInit = function() {
      // invoke the original ngAfterViewInit method if it exists
      if (originalNgAfterViewInit) {
        originalNgAfterViewInit();
      }

      const handler = target[propertyKey].bind(this);
      const contextRequest = new ContextRequestEvent(token, handler, true);

      const element = this.elementRef.nativeElement;
      element.dispatchEvent(contextRequest);
    };
  }
}
