import { Directive, Input, OnChanges } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { DatatablePaginationDirective } from "@directives/datatable/pagination/pagination.directive";
import { AbstractModel } from "@models/AbstractModel";
import { map, Observable, of, startWith } from "rxjs";

export type VirtualDatabaseModelInput<T extends AbstractModel> = () => Observable<T[]>;

/**
 * @description
 * A directive that adds pagination to an array of models.
 *
 * This is similar to the [bawDatatablePagination] directive, but does not
 * require an API filter backing.
 *
 * @example
 * ```html
 * <ngb-datatable
 *  bawDatatableDefaults
 *  [bawVirtualDatatablePagination]="
 *    importFileApi.dryRun().pipe(map(model) => model.subModel));
 *  ">
 * ```
 */
@Directive({
  selector: "[bawVirtualDatatablePagination]",
  standalone: false,
})
export class VirtualDatatablePaginationDirective<Model extends AbstractModel>
  extends DatatablePaginationDirective<Model>
  implements OnChanges
{
  // TODO: This component should accept models that are not an AbstractModel
  @Input("bawVirtualDatatablePagination") public models: VirtualDatabaseModelInput<Model>;

  public ngOnChanges(): void {
    this.pagination = { getModels: this.getModels.bind(this) };
  }

  private getModels(filters: Filters<Model>): Observable<Model[]> {
    // because the models input is optional, we want to return an empty table
    // if no models are provided (undefined).
    // this can occur if the models are still being fetched as an associated
    // model.
    if (!this.models) {
      return of([]);
    }

    const pageNumber = filters.paging.page ?? 1;
    const pageSize = this.rowLimit;

    return this.models().pipe(
      startWith([]),
      // we don't support sorting, but we can apply the paging filter
      map((models: Model[]) => {
        const start = (pageNumber - 1) * pageSize;
        const end = Math.min(start + pageSize, models.length);

        // we add metadata to the models so that the pagination directive can
        // fetch the total number of models, the page number, etc... as if
        // the models were fetched from an API
        models.forEach((model: AbstractModel) => {
          model.addMetadata({
            paging: {
              page: pageNumber,
              items: pageSize,
              total: models.length,
              maxPage: Math.ceil(models.length / pageSize),
            },
          });
        });

        return models.slice(start, end);
      }),
    );
  }
}
