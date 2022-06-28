import { AfterContentInit, Directive, Host, Input } from "@angular/core";
import { Direction, Filters, Sorting } from "@baw-api/baw-api.service";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AbstractModel } from "@models/AbstractModel";
import {
  DataTableColumnDirective,
  DatatableComponent,
  TableColumn,
} from "@swimlane/ngx-datatable";
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";

/**
 * DatatablePaginationDirective
 *
 * This simplifies the process of adding pagination to a datatable.
 *
 * ## Example using RXJS Filters
 *
 * ```ts
 * class Example {
 *    public getModels = (filters) => this.api.filter(filters);
 *    public filters$ = new BehaviorSubject<Filters<Model>>({filter: {id: {gt: 10}}});
 * }
 * ```
 *
 * ```html
 * <ngx-datatable
 *  bawDatatableDefaults
 *  [bawDatatablePagination]="{ filters: filters$, getModels: getModels}">
 *    ...
 * </ngx-datatable>
 * ```
 *
 * ## Example using basic Filters
 *
 * ```ts
 * class Example {
 *    public getModels = (filters) => this.api.filter(filters);
 *    public filters = {filter: {id: {gt: 10}}};
 * }
 * ```
 *
 * ```html
 * <ngx-datatable
 *  bawDatatableDefaults
 *  [bawDatatablePagination]="{ filters: filters, getModels: getModels}">
 *    ...
 * </ngx-datatable>
 * ```
 *
 * ## Example with columns
 *
 * ```html
 * <ngx-datatable
 *  bawDatatableDefaults
 *  [bawDatatablePagination]="{ filters: filters, getModels: getModels}">
 *    <ngx-datatable-column prop="id">
 *      <ng-template let-value="value" ngx-datatable-cell-template>
 *        {{ value }}
 *      </ng-template>
 *    </ngx-datatable-column>
 * </ngx-datatable>
 * ```
 *
 * ## Example with associated models
 *
 * We can't directly use the value, as angular will not detect changes unless
 * the user hovers over the row, leaving the loading animation forever until
 * then.
 *
 * ```html
 * <ngx-datatable
 *  bawDatatableDefaults
 *  [bawDatatablePagination]="{ filters: filters, getModels: getModels}">
 *   <ng-template let-row="row" ngx-datatable-cell-template>
 *     <baw-loading
 *       *ngIf="row.site | isUnresolved; else site"
 *       size="sm"
 *     ></baw-loading>
 *     <ng-template #site>
 *       <a [bawUrl]="row.site.viewUrl">
 *         {{ row.site.name }}
 *       </a>
 *     </ng-template>
 *   </ng-template>
 * </ngx-datatable>
 * ```
 */
@Directive({
  selector: "[bawDatatablePagination]",
})
export class DatatablePaginationDirective<Model extends AbstractModel>
  extends withUnsubscribe()
  implements AfterContentInit
{
  /**
   * @param filters Base api filters for table. If this is an observable, on
   * trigger, it will update the table to match the new filters. If this is a
   * plain object, it will be used directly. This value is not compatible with
   * the async pipe
   * @param getModels Get models for the table. This will be fed the filters
   * for the current page of the table, and should output the matching models
   */
  // eslint-disable-next-line @typescript-eslint/quotes
  @Input("bawDatatablePagination") public pagination: {
    filters?: BehaviorSubject<Filters<Model>> | Filters<Model>;
    getModels: (filters: Filters<Model>) => Observable<Model[]>;
  };

  /** Base API filters, this is extracted from the pagination input */
  private filters$: Observable<Filters<Model>>;
  /**
   * Observable which outputs each table row. Each row value will be the model
   * retrieved from the api request
   */
  private rows$: Observable<any[]>;
  /**
   * Observable tracking the total number of models for the current base filter
   */
  private total$: Observable<number>;
  /** Observable tracking when the table is loading new data */
  private loading$ = new BehaviorSubject<boolean>(false);
  /**
   * Observable tracking any changes to the current page, or sort, of the table
   */
  private pageAndSort$ = new BehaviorSubject<PageAndSort<Model>>({ page: 0 });

  public constructor(@Host() private datatable: DatatableComponent) {
    super();
  }

  public ngAfterContentInit(): void {
    // Convert basic filters to observable
    this.filters$ =
      this.pagination.filters instanceof BehaviorSubject
        ? this.pagination.filters
        : of(this.pagination.filters ?? {});

    // Reset page number on filter change, but keep current sort
    this.filters$.pipe(takeUntil(this.unsubscribe)).subscribe((filters) => {
      const pageAndSort = this.pageAndSort$.getValue();

      // If the user has already sorted the table, use their sort
      if (pageAndSort.sort || !filters.sorting) {
        this.pageAndSort$.next({ page: 0, sort: pageAndSort.sort });
        return;
      }

      // Otherwise, use the sort from the filter observable as the default
      this.datatable.sorts = [
        { prop: filters.sorting.orderBy, dir: filters.sorting.direction },
      ];
      this.pageAndSort$.next({ page: pageAndSort.page, sort: filters.sorting });
    });

    // Get the latest list of models whenever a change occurs to the page,
    // sorting, or base filters
    this.rows$ = combineLatest([this.pageAndSort$, this.filters$]).pipe(
      // Show loading animation during request
      tap((): void => this.loading$.next(true)),
      // Combine base filter, paging, and sorting
      map(
        ([pageAndSort, filters]): Filters<Model> => ({
          ...filters,
          sorting: pageAndSort.sort ?? undefined,
          // ngx-datatable uses page 0 as the first page, but the api uses page 1
          paging: { page: pageAndSort.page + 1 },
        })
      ),
      switchMap(
        (filters): Observable<Model[]> => this.pagination.getModels(filters)
      ),
      tap((): void => this.loading$.next(false))
    );

    this.total$ = this.rows$.pipe(
      // Get the total number of models for the current filter from the
      // responses metadata
      map((models): number => models[0]?.getMetadata().paging.total ?? 0)
    );

    this.subscribeToTableOutputs();
    this.setTableInputs();
  }

  /** Re-triggers the pageAndSort$ observable with the new page number */
  public setPage = (page: DatatablePageEvent): void => {
    this.pageAndSort$.next({
      page: page.offset,
      sort: this.pageAndSort$.getValue().sort,
    });
  };

  /**
   * Re-triggers the pageAndSort$ observable with the new sort values. This
   * also resets the page number to 0
   */
  public onSort = (event: DatatableSortEvent): void => {
    if (!event.newValue) {
      // Trigger with unset sort, and reset page to 0
      this.pageAndSort$.next({ sort: null, page: 0 });
    } else {
      const sortKey = event.column.sortKey ?? event.column.prop?.toString();

      // Trigger with new sorting value and reset page to 0
      this.pageAndSort$.next({
        sort: { direction: event.newValue, orderBy: sortKey as keyof Model },
        page: 0,
      });
    }
  };

  /** Subscribes to tables paging and sorting events */
  private subscribeToTableOutputs(): void {
    // Set page number whenever changed
    this.datatable.page.subscribe((page): void => {
      this.setPage(page);
    });

    // Set sorting whenever changed
    this.datatable.sort.subscribe((sort): void => {
      this.onSort(sort);
    });
  }

  /** Sets table inputs with latest values from observables */
  private setTableInputs(): void {
    // Set table rows on change
    this.rows$.pipe(takeUntil(this.unsubscribe)).subscribe((rows): void => {
      this.datatable.rows = rows;
    });

    // Set loading state on change
    this.loading$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((isLoading): void => {
        this.datatable.loadingIndicator = isLoading;
      });

    // Set count on change
    this.total$.pipe(takeUntil(this.unsubscribe)).subscribe((total): void => {
      this.datatable.count = total;
    });

    // Set page number on change
    this.pageAndSort$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ page }): void => {
        this.datatable.offset = page;
      });
  }
}

/** Page number */
type Page = number;
/** API sorting metadata */
type Sort<Model> = Sorting<keyof Model>;
/** Page and sort data, no sort if left unset */
interface PageAndSort<Model> {
  page: Page;
  sort?: Sort<Model>;
}

/** TableColumns with  */
export type Column<Model> = TableColumn & { sortKey: keyof Model };

/** NgxDatatable page event data */
export interface DatatablePageEvent {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;
}

/** NgxDatatable sort event data */
export interface DatatableSortEvent {
  newValue: Direction;
  prevValue: Direction;
  column: DataTableColumnDirective & { sortKey: string };
}
