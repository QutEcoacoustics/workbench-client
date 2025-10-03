import { InnerFilter } from "@baw-api/baw-api.service";
import { AbstractModelWithoutId } from "@models/AbstractModel";
import { filterAnd, filterOr } from "./filters";

type MergeStrategy = typeof filterAnd | typeof filterOr;

/**
 * @description
 * Merges a complex inner filter for an associated model into an existing filter
 *
 * @param ctor The constructor of the associated model
 * @param associationFilter The inner filter for the associated model
 * @param baseFilter (optional)
 * A filter that the association filter will be merged into.
 * If no filter is provided, a new filter will be created.
 *
 * @example
 * ```ts
 * const sitesFilter: InnerFilter<Site> = {
 *   name: { contains: "test" }
 * };
 *
 * const projectsFilter: InnerFilter<Project> = {
 *   id: { eq: 1 }
 * };
 *
 * const combinedFilter = associationModelFilter(
 *   Project,
 *   projectsFilter
 *   sitesFilter,
 * );
 *
 * console.log(combinedFilter);
 * // Output:
 * // {
 * //   and: [
 * //     { "name": { contains: "test" } },
 * //     { "projects.id": { eq: 1 } },
 * //   ],
 * // }
 * ```
 *
 * Note that the projects filter was merged into the existing sites filter.
 */
export function associationModelFilter<
  AssociationModel extends AbstractModelWithoutId,
  BaseModel extends AbstractModelWithoutId,
>(
  associationKey: AssociationModel["kind"],
  associationFilter: InnerFilter<AssociationModel>,
  baseFilter: InnerFilter<BaseModel> = {},
  merge: MergeStrategy = filterAnd,
) {
  // https://github.com/QutEcoacoustics/baw-server/wiki/API%3A-Filtering#advanced-filtering-for-resource
  //
  // Filtering a base model by an associated model field is done by prefixing
  // the associated model's key to the field name.
  // Therefore, we have to unwrap the association filters and prefix all of the
  // object keys with the association key.
  const unwrappedAssociationFilter: InnerFilter<BaseModel> = {};

  // TODO: Add support for combinators ("and", "or", "not")
  for (const [key, value] of Object.entries(associationFilter)) {
    unwrappedAssociationFilter[`${associationKey}.${key}` as any] = value;
  }

  return merge(baseFilter, unwrappedAssociationFilter);
}
