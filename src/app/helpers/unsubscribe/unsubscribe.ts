import { OnDestroy, Type } from "@angular/core";
import { Subject } from "rxjs";

/**
 * Create unsubscribe subject. This can be used by `takeUntil` to automatically
 * complete subjects.
 *
 * @param Base Base Class
 */
export function WithUnsubscribe<T extends Type<{}>>(Base: T = class {} as any) {
  return class extends Base implements OnDestroy {
    protected unsubscribe = new Subject<void>();

    public ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
    }
  };
}
