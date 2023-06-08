import { InnerFilter } from "@baw-api/baw-api.service";
import { Writeable } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";

/**
 * Adds an inner filter to the root of an existing filter in an `and` expression
 *
 * @param filter The current inner filter conditions
 * @param newFilter A new inner filter condition that will be added in an `and` expression
 * @returns A new filter which satisfies the intersection between the two filters
 */
export function filterAnd<T extends AbstractModel>(
  filter: InnerFilter,
  newFilter: InnerFilter
): InnerFilter<Writeable<T>> {
  if (!newFilter || Object.keys(newFilter).length === 0) {
    return filter;
  }

  // because the api is expecting multiple conditions with the and combinator condition
  // if there are multiple conditions, we need to wrap the filter in an and: [] combinator
  // if there is only a single condition, the filter should be returned without the and block
  if (!filter || Object.keys(filter).length === 0) {
    return newFilter;
  } else {
    // if the current filter already contains an "and" conditional block, the additional filter should be added to the existing "and" block
    // otherwise, the current and additional filters should be wrapped in an "and" conditional block together
    return {
      and: filter.and
        ? [...(filter.and as InnerFilter[]), newFilter]
        : [filter, newFilter],
    };
  }
}

export function filterOr<T extends AbstractModel>(
  filter: InnerFilter,
  newFilter: InnerFilter
): InnerFilter<Writeable<T>> {
  if (!newFilter || Object.keys(newFilter).length === 0) {
    return filter;
  }

  // because the api is expecting multiple conditions with the or combinator condition
  // if there are multiple conditions, we need to wrap the filter in an or: [] combinator
  // if there is only a single condition, the filter should be returned without the or block
  if (!filter || Object.keys(filter).length === 0) {
    return newFilter;
  } else {
    // if the current filter already contains an "or" conditional block, the additional filter should be added to the existing "or" block
    // otherwise, the current and additional filters should be wrapped in an "or" conditional block together
    return {
      or: filter.or
        ? [...(filter.or as InnerFilter[]), newFilter]
        : [filter, newFilter],
    };
  }
}

/**
 * Adds a new filter to an existing filter that filters by a model's id
 *
 * @param key The key identifier of the model, most likely the type
 * @example key = "projects"
 * @param model The model to filter by
 * @param currentFilter (optional) A filter that model condition will be added to. If no filter is provided, a new filter will be created
 * @returns A new filter with the model condition added
 */
export function filterModel<T extends AbstractModel, U extends AbstractModel>(
  key: string,
  model: T,
  currentFilter: InnerFilter
): InnerFilter<Writeable<U>> {
  // all model filters condition on the id attribute. While it is very rare for a model to not have an id, it is possible
  // this bailout is typically evoked if the model is undefined
  if (!isInstantiated(model?.id)) {
    return currentFilter;
  }

  const additionalFilter: InnerFilter = {
    [`${key}.id`]: {
      eq: model.id,
    },
  };

  return filterAnd(currentFilter, additionalFilter);
}
