import { Signal, inject } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { combineLatest, map, of, switchMap } from "rxjs";

export function resolveSites(
  rows: Signal<readonly { siteId: number }[]>,
): Signal<Map<number, Site> | undefined> {
  const sitesApi = inject(ShallowSitesService);

  return toSignal(
    toObservable(rows).pipe(
      switchMap((coverageRows) => {
        const siteIds = Array.from(
          new Set(coverageRows.map(({ siteId }) => siteId)),
        );

        if (siteIds.length === 0) {
          return of(new Map<number, Site>());
        }

        // Individual show requests reuse sites already loaded by model
        // associations and coalesce concurrent requests for the same site.
        // These streams can remain open, so render after each has emitted
        // rather than waiting for them to complete.
        return combineLatest(
          siteIds.map((siteId) =>
            sitesApi.show(siteId).pipe(map((site) => [siteId, site] as const)),
          ),
        ).pipe(map((sites) => new Map(sites)));
      }),
    ),
  );
}
