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

type Page = number | null;
type Sort<Model> = Sorting<keyof Model> | null;

@Directive({
  selector: "[bawDatatablePagination]",
})
export class DatatablePaginationDirective<Model extends AbstractModel>
  extends withUnsubscribe()
  implements OnInit
{
  @Input() public filters$: Observable<Filters<Model>>;
  @Input() public models: (filters: Filters<Model>) => Observable<Model[]>;
  @Input() public columns: Column<Model>[];

  private rows$: Observable<any>;
  private total$: Observable<number>;
  private loading$ = new BehaviorSubject<boolean>(false);
  private page$ = new BehaviorSubject<Page>(0);
  private sort$ = new BehaviorSubject<Sort<Model>>(undefined);

  public constructor(@Host() private datatable: DatatableComponent) {
    super();
  }

  public ngOnInit(): void {
    const models$ = combineLatest([this.page$, this.sort$, this.filters$]).pipe(
      tap((): void => this.loading$.next(true)),
      map(
        ([page, sort, filters]): Filters<Model> => ({
          ...filters,
          sorting: sort ?? undefined,
          paging: { page: page + 1 },
        })
      ),
      switchMap((filters): Observable<Model[]> => this.models(filters)),
      tap((): void => this.loading$.next(false))
    );

    this.rows$ = models$.pipe(
      map((models) =>
        models.map((model) =>
          this.columns
            .map((column) => ({ [column.prop]: model }))
            .reduce((previous, current) => ({ ...previous, ...current }), {})
        )
      )
    );

    this.total$ = models$.pipe(
      map((models) => models[0]?.getMetadata().paging.total ?? 0)
    );

    this.subscribeToTableOutputs();
    this.setTableInputs();
  }

  public setPage = (page: PageEvent): void => {
    this.page$.next(page.offset);
  };

  public onSort = (event: SortEvent): void => {
    if (!event.newValue) {
      this.sort$.next(null);
      this.page$.next(0);
    } else {
      const orderBy = this.columns.find(
        (column) => column.name === event.column.name
      ).key;
      this.sort$.next({ direction: event.newValue, orderBy });
      this.page$.next(0);
    }
  };

  private subscribeToTableOutputs(): void {
    // Subscribe to events
    this.datatable.page.subscribe((page): void => {
      this.setPage(page);
    });

    this.datatable.sort.subscribe((sort): void => {
      this.onSort(sort);
    });
  }

  private setTableInputs(): void {
    // Set inputs
    this.rows$.pipe(takeUntil(this.unsubscribe)).subscribe((rows): void => {
      this.datatable.rows = rows;
    });

    this.loading$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((isLoading): void => {
        this.datatable.loadingIndicator = isLoading;
      });

    this.total$.pipe(takeUntil(this.unsubscribe)).subscribe((total): void => {
      this.datatable.count = total;
    });

    this.page$.pipe(takeUntil(this.unsubscribe)).subscribe((page): void => {
      this.datatable.offset = page;
    });
  }
}

export type Column<Model> = TableColumn & { key: keyof Model };

interface PageEvent {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;
}

interface SortEvent {
  newValue: Direction;
  prevValue: Direction;
  column: {
    sortable: boolean;
    prop: string;
    name: string;
  };
}
