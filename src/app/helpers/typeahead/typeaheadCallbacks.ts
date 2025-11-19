import { ApiFilter } from "@baw-api/api-common";
import { AbstractModelWithoutId } from "@models/AbstractModel";
import { contains, filterAnd, notIn } from "@helpers/filters/filters";
import { Observable, of } from "rxjs";
import { InnerFilter, Projection } from "@baw-api/baw-api.service";
import { TypeaheadInputComponent, TypeaheadSearchCallback } from "../../components/shared/typeahead-input/typeahead-input.component";

// create a callback that can be used to filter for items in a typeahead
// TODO: Places that use this helper should be replaced with a service method
// e.g. createSearchCallback(this.tagsService) should be replaced with a service
// method such as this.tagsService.searchCallback()
export function createSearchCallback<T extends AbstractModelWithoutId>(
  api: ApiFilter<T>,
  key: keyof T,
  filters: InnerFilter<T> = {},
  projection?: Projection<T>,
): TypeaheadSearchCallback<T> {
  return (text: any, activeItems: T[]): Observable<T[]> =>
    api.filter({
      filter: filterAnd(
        contains<T, keyof T>(key, text, filters),

        // we add a "not in" condition to exclude items that are already
        // selected
        notIn<T>(key, activeItems)
      ),
      paging: { items: TypeaheadInputComponent.maximumResults },
      projection,
    });
}

// TODO: Places that use this helper should be replaced with a service method
export function createIdSearchCallback<T extends AbstractModelWithoutId>(
  api: ApiFilter<T>,
  key: keyof T,
  filters: InnerFilter<T> = {},
  projection?: Projection<T>,
): TypeaheadSearchCallback<T> {
  return (text: any): Observable<T[]> => {
    const id = Number(text);
    if (!isFinite(id)) {
      throw new Error("Invalid id");
    }

    return api.filter({
      filter: filterAnd({ [key]: { eq: id } } as any, filters),
      paging: { items: TypeaheadInputComponent.maximumResults },
      projection,
    });
  };
}

/**
 * Creates a search callback that can be used by the typeahead input to search
 * through an array of items.
 */
export function createItemSearchCallback<T>(
  items: T[]
): TypeaheadSearchCallback<T> {
  const maxResults = TypeaheadInputComponent.maximumResults;
  return (searchTerm: string) => {
    const filteredItems = items.filter((item) => {
      const itemText = item.toString().toLowerCase();
      return itemText.includes(searchTerm.toLowerCase());
    });

    return of(filteredItems.slice(0, maxResults));
  };
}
