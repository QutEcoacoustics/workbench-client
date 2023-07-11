import { InnerFilter } from "@baw-api/baw-api.service";
import { Writeable } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Id } from "@interfaces/apiInterfaces";
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
  currentFilter: InnerFilter<T> = {}
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

  return filterAnd<T>(currentFilter, additionalFilter);
}

/**
 * Adds a new filter to an existing filter that filters by several model ids
 *
 * @param key The key identifier of the model, most likely the type
 * @example key = "projects"
 * @param model The model to filter by
 * @param currentFilter (optional) A filter that model condition will be added to. If no filter is provided, a new filter will be created
 * @returns A new filter with the model conditions added
 */
export function filterModelIds<T extends AbstractModel>(
  key: string,
  ids: Id[],
  currentFilter: InnerFilter<T> = {}
): InnerFilter<Writeable<T>> {
  if (!isInstantiated(ids)) {
    return currentFilter;
  }

  const additionalFilter: InnerFilter = {
    [`${key}.id`]: {
      in: ids,
    },
  };

  return filterAnd<T>(currentFilter, additionalFilter);
}

export function propertyFilter<T extends AbstractModel>(
  key: keyof T,
  value: T[keyof T],
  currentFilter: InnerFilter<T> = {}
): InnerFilter<Writeable<T>> {
  if (!isInstantiated(value)) {
    return currentFilter;
  }

  const additionalFilter: InnerFilter = {
    [key]: {
      contains: value,
    },
  };

  return filterAnd<T>(currentFilter, additionalFilter);
}

export function excludePropertyValues<T extends AbstractModel>(
  key: keyof T,
  values: T[],
  currentFilter: InnerFilter<T> = {}
): InnerFilter<Writeable<T>> {
  if (!isInstantiated(values)) {
    return currentFilter;
  }

  const additionalFilter: InnerFilter = {
    [key]: {
      notIn: values.map((item: T) => item[key]),
    },
  };

  return filterAnd<T>(currentFilter, additionalFilter);
}
