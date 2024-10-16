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
export function ContextHandler(context: unknown) {
  return (target: any, propertyKey: string) => {
    console.log(target, propertyKey, context);
  }
}
