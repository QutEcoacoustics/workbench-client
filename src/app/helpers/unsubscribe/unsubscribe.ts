import { OnDestroy, Type } from "@angular/core";
import { Subject } from "rxjs";

export function WithUnsubscribe<T extends Type<{}>>(Base: T = class {} as any) {
  return class extends Base implements OnDestroy {
    protected unsubscribe = new Subject<void>();

    ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
    }
  };
}
