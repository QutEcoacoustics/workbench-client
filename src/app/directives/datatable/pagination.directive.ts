/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, Host, Input, OnInit } from "@angular/core";
import { Direction, Filters, Sorting } from "@baw-api/baw-api.service";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AbstractModel } from "@models/AbstractModel";
import { DatatableComponent, TableColumn } from "@swimlane/ngx-datatable";
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
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
 *    public asModel = (model: any): Model => model;
 *    public getModels = (filters) => this.api.filter(filters);
 *    public columns = [{key: "id", name: "Id"}]
 *    public filters$ = new BehaviorSubject<Filters<Model>>({filter: {id: {gt: 10}}});
 * }
 * ```
 *
 * ```html
 * <ngx-datatable
 *  bawDatatableDefaults
 *  bawDatatablePagination
 *  [paginationFilters$]="filters$"
 *  [paginationGetModels]="getModels"
 *  [columns]="columns">
 *    <ngx-datatable-column name="Id">
 *      <ng-template let-value="value" ngx-datatable-cell-template>
 *        {{ asModel(value).id }}
 *      </ng-template>
 *    </ngx-datatable-column>
 * </ngx-datatable>
 * ```
 *
 * ## Example using basic Filters
 *
 * ```ts
 * class Example {
 *    public asModel = (model: any): Model => model;
 *    public getModels = (filters) => this.api.filter(filters);
 *    public columns = [{key: "id", name: "Id"}]
 *    public filters = {filter: {id: {gt: 10}}};
 * }
 * ```
 *
 * ```html
 * <ngx-datatable
 *  bawDatatableDefaults
 *  bawDatatablePagination
 *  [paginationFilters]="filters"
 *  [paginationGetModels]="getModels"
 *  [columns]="columns">
 *    <ngx-datatable-column name="Id">
 *      <ng-template let-value="value" ngx-datatable-cell-template>
 *        {{ asModel(value).id }}
 *      </ng-template>
 *    </ngx-datatable-column>
 * </ngx-datatable>
 * ```
 */
@Directive({
  selector: "[bawDatatablePagination]",
})
export class DatatablePaginationDirective<Model extends AbstractModel>
  extends withUnsubscribe()
  implements OnInit
{
  /**
   * Base api filters for table. On trigger, this will update the table to
   * match the new filters
   */
  @Input("paginationFilters$") public filters$: Observable<Filters<Model>>;
  /** Base api filters for table */
  @Input("paginationFilters") public filters: Filters<Model>;
  /**
   * Get models for table. This will be fed the filters for the current page of
   * the table, and should output the matching models
   */
  @Input("paginationGetModels") public getModels: (
    filters: Filters<Model>
  ) => Observable<Model[]>;
  /**
   * Shared with ngx-datatable columns input, this should include the key (used
   * for filter requests, and should be a filterable model key) and name of the
   * column (used by ngx-datable for column names)
   */
  @Input() public columns: Column<Model>[];

  /**
   * Observable which outputs each table row. Each row value will be the model
   * retrieved from the api request
   */
  private rows$: Observable<any>;
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

  public ngOnInit(): void {
    // Convert basic filters to observable
    if (this.filters && !this.filters$) {
      this.filters$ = new BehaviorSubject(this.filters);
    }

    // Get the latest list of models whenever a change occurs to the page,
    // sorting, or base filters
    const models$ = combineLatest([this.pageAndSort$, this.filters$]).pipe(
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
      switchMap((filters): Observable<Model[]> => this.getModels(filters)),
      // Clear loading animation
      tap((): void => this.loading$.next(false))
    );

    // Convert models into rows by creating an object where each key is the
    // column prop, and the value is the model
    const convertToRow = (model: Model): any =>
      this.columns
        .map((column) => ({ [column.prop]: model }))
        .reduce((previous, current) => ({ ...previous, ...current }), {});
    this.rows$ = models$.pipe(
      map((models) => models.map((model) => convertToRow(model)))
    );

    // Get the total number of models for the current filter from the
    // responses metadata
    this.total$ = models$.pipe(
      map((models) => models[0]?.getMetadata().paging.total ?? 0)
    );

    this.subscribeToTableOutputs();
    this.setTableInputs();
  }

  /** Re-triggers the pageAndSort$ observable with the new page number */
  public setPage = (page: PageEvent): void => {
    this.pageAndSort$.next({
      page: page.offset,
      sort: this.pageAndSort$.value.sort,
    });
  };

  /**
   * Re-triggers the pageAndSort$ observable with the new sort values. This
   * also resets the page number to 0
   */
  public onSort = (event: SortEvent): void => {
    if (!event.newValue) {
      // Trigger with unset sort, and reset page to 0
      this.pageAndSort$.next({ sort: null, page: 0 });
    } else {
      // Extract sorting key from columns
      const orderBy = this.columns.find(
        (column) => column.name === event.column.name
      ).key;
      // Trigger with new sorting value and reset page to 0
      this.pageAndSort$.next({
        sort: { direction: event.newValue, orderBy },
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
export type Column<Model> = TableColumn & { key: keyof Model };

/** NgxDatatable page event data */
interface PageEvent {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;
}

/** NgxDatatable sort event data */
interface SortEvent {
  newValue: Direction;
  prevValue: Direction;
  column: {
    sortable: boolean;
    prop: string;
    name: string;
  };
}
