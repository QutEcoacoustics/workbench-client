import { ApiFilter } from "@baw-api/api-common";
import { AbstractModelWithoutId } from "@models/AbstractModel";
import { contains, filterAnd, notIn } from "@helpers/filters/filters";
import { Observable } from "rxjs";
import { InnerFilter } from "@baw-api/baw-api.service";
import { TypeaheadSearchCallback } from "./typeahead-input.component";

// create a callback that can be used to filter for items in a typeahead
export function createSearchCallback<T extends AbstractModelWithoutId>(
  api: ApiFilter<T>,
  key: keyof T,
  filters: InnerFilter<T> = {}
): TypeaheadSearchCallback {
  return (text: any, activeItems: T[]): Observable<T[]> =>
    api.filter({
      filter: filterAnd(
        contains<T, keyof T>(key, text, filters),

        // we add a "not in" condition to exclude items that are already selected
        notIn<T>(key, activeItems)
      ),
    });
}
