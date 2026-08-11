import { Signal, inject } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { TagsService } from "@baw-api/tag/tags.service";
import { TagFrequencyReportItem } from "@models/Reports";
import { Tag } from "@models/Tag";
import { combineLatest, map, of, switchMap } from "rxjs";

export function resolveTags(
  rows: Signal<readonly TagFrequencyReportItem[]>,
): Signal<Map<number, Tag> | undefined> {
  const tagsApi = inject(TagsService);

  return toSignal(
    toObservable(rows).pipe(
      switchMap((reportRows) => {
        const tagIds = Array.from(
          new Set(
            reportRows.flatMap(({ tags }) => tags.map(({ tagId }) => tagId)),
          ),
        );

        if (tagIds.length === 0) {
          return of(new Map<number, Tag>());
        }

        // Individual show requests reuse tags already loaded by model
        // associations and coalesce concurrent requests for the same tag.
        // These streams can remain open, so render after each has emitted
        // rather than waiting for them to complete.
        return combineLatest(
          tagIds.map((tagId) =>
            tagsApi.show(tagId).pipe(map((tag) => [tagId, tag] as const)),
          ),
        ).pipe(map((tags) => new Map(tags)));
      }),
    ),
  );
}

export function createTagFormatter(
  tags: Signal<Map<number, Tag> | undefined>,
): (tagId: unknown) => string {
  return (tagId: unknown): string =>
    typeof tagId === "number"
      ? (tags()?.get(tagId)?.text ?? tagId.toString())
      : "";
}
