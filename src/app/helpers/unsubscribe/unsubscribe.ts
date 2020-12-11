import { OnDestroy, Type } from "@angular/core";
import { Subject } from "rxjs";

/**
 * Create unsubscribe subject. This can be used by `takeUntil` to automatically
 * complete subjects.
 *
 * @param base Base Class
 */
export function withUnsubscribe<T extends Type<any>>(
  base: T = class {} as any
) {
  return class extends base implements OnDestroy {
    protected unsubscribe = new Subject<void>();

    public ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
      super.ngOnDestroy?.();
    }
  };
}
