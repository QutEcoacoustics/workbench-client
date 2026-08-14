import { OnDestroy, Type } from "@angular/core";
import { Subject } from "rxjs";

/**
 * Create unsubscribe subject. This can be used by `takeUntil` to automatically
 * complete subjects.
 *
 * @param base Base Class
 */
export function withUnsubscribe<
  T extends Type<{
    constructor: unknown;
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    ngOnDestroy?();
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    ngOnInit?();
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    ngAfterViewInit?();
  }>
>(base: T = class {} as any) {
  return class extends base implements OnDestroy {
    public unsubscribe = new Subject<void>();

    public ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
      super.ngOnDestroy?.();
    }
  };
}
