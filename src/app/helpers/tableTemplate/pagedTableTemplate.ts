import { Directive, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiFilter } from "@baw-api/api-common";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { PageInfo } from "@helpers/page/pageInfo";
import { AbstractModel } from "@models/AbstractModel";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
  SortType,
  TableColumn,
} from "@swimlane/ngx-datatable";
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { defaultDebounceTime } from "src/app/app.helper";
import { PageComponent } from "../page/pageComponent";

export interface ColumnData<T, M extends AbstractModel> {
  key: string;
  name: string;
  transform: (model: M) => any;
  width?: number;
  sortKey?: keyof T;
  isFilterKey?: boolean;
  cellTemplate?: () => any;
}

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class PagedTableTemplateV2<T, M extends AbstractModel>
  extends PageComponent
  implements OnInit {
  @ViewChild(DatatableComponent) public table: DatatableComponent;

  // Table variables
  public ColumnMode = ColumnMode;
  public SortType = SortType;
  public SelectionType = SelectionType;
  public columns: TableColumn[] = [];
  public rows: any[] = [];
  public selected: any[] = [];
  public sortKeys: { [key: string]: keyof T } = {};
  public filterKey: keyof T;
  public totalModels: number;

  /** API Error Response for Table Data */
  public error: ApiErrorDetails;
  /** API Error Response from Resolvers */
  public failure: boolean;
  public loadingData: boolean;
  public models: ResolvedModelList = {};
  public pageNumber: number;
  public filterEvent$ = new Subject<string>();
  private filters: Filters<M>;

  constructor(
    protected api: ApiFilter<any, any>,
    public columnData: ColumnData<T, M>[],
    private route?: ActivatedRoute,
    private getUrlParameters: (component: any) => AbstractModel[] = () => []
  ) {
    super();
    this.pageNumber = 0;
    this.filters = {};

    this.filterEvent$
      .pipe(
        debounceTime(defaultDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => this.getPageData(),
        // Filter event doesn't have an error output
        (err) => {}
      );
  }

  public ngOnInit() {
    this.createColumns();

    if (this.route) {
      const models = retrieveResolvers(this.route.snapshot.data as PageInfo);
      if (!models) {
        this.failure = true;
        return;
      }
      this.models = models;
    }

    this.getPageData();
  }

  /**
   * Set the new page number
   * @param pageInfo Information about current page
   */
  public setPage(pageInfo: TablePage) {
    this.pageNumber = pageInfo.offset;
    this.filters.paging = {
      page: pageInfo.offset + 1,
    };

    this.getPageData();
  }

  /**
   * Handle filter events
   * @param filter Filter text
   */
  public onFilter(filter: string) {
    if (!filter) {
      this.filters.filter = undefined;
    } else {
      this.filters.filter = {
        // TODO Figure out how to get this typing working
        [this.filterKey as any]: { contains: filter },
      };
    }

    this.filterEvent$.next(filter);
  }

  /**
   * Handle sorting events
   * @param event Sort Event
   */
  public onSort(event: SortEvent) {
    if (!event.newValue) {
      this.filters.sorting = undefined;
    } else {
      this.filters.sorting = {
        orderBy: this.sortKeys[event.column.prop] as string,
        direction: event.newValue,
      };
    }

    this.getPageData();
  }

  /**
   * Retrieve page data for the table. If you are trying to customize
   * the request, override `apiAction` instead
   */
  public getPageData() {
    this.loadingData = true;
    this.rows = [];

    this.apiAction(this.filters, this.getUrlParameters(this))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => {
          this.rows = this.createRows(models);
          this.loadingData = false;

          if (models.length > 0) {
            const meta = models[0].getMetadata();
            this.totalModels = meta.paging.total;
          } else {
            this.totalModels = 0;
          }
        },
        (err: ApiErrorDetails) => {
          this.error = err;
          this.rows = undefined;
          this.loadingData = false;
        }
      );
  }

  /**
   * API Request. Override this if you wish to make a more
   * customized request
   */
  protected apiAction(
    filters: Filters<M>,
    args: AbstractModel[]
  ): Observable<M[]> {
    return this.api.filter(filters, ...args);
  }

  /**
   * Create datatable rows
   */
  protected createRows(models: M[]) {
    return models.map((model) => {
      const row = {};
      this.columnData.forEach(
        (column) => (row[column.key] = column.transform(model))
      );
      return row;
    });
  }

  /**
   * Convert columnData into columns which ngx-datatable will
   * understand. This also extract the sort keys, and filter key.
   */
  private createColumns() {
    this.columnData.forEach((column) => {
      this.columns.push({
        name: column.name,
        sortable: !!column.sortKey,
        width: column.width,
        maxWidth: column.width,
        cellTemplate: column.cellTemplate?.(),
      });
      if (column.sortKey) {
        this.sortKeys[column.key] = column.sortKey;
      }
      if (column.isFilterKey) {
        this.filterKey = column.sortKey;
      }
    });
  }
}

/**
 * Paged Template Class.
 * Handles creating all the generic logic required for a datatable containing component
 * which requires the use of external sorting and paging.
 */
@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class PagedTableTemplate<T, M extends AbstractModel>
  extends PageComponent
  implements OnInit {
  @ViewChild(DatatableComponent) public table: DatatableComponent;

  // Table variables
  public ColumnMode = ColumnMode;
  public SortType = SortType;
  public SelectionType = SelectionType;
  public columns: TableColumn[] = [];
  public rows: T[];
  public selected: T[] = [];
  public sortKeys: { [key: string]: string };
  public filterKey: keyof M;
  public totalModels: number;

  /**
   * API Error Response for Table Data
   */
  public error: ApiErrorDetails;
  /**
   * API Error Response from Resolvers
   */
  public failure: boolean;
  public loadingData: boolean;
  public models: ResolvedModelList = {};
  public pageNumber: number;
  public filterEvent$ = new Subject<string>();
  private filters: Filters<M>;

  constructor(
    protected api: ApiFilter<any, any>,
    private rowsCallback: (models: M[]) => T[],
    private route?: ActivatedRoute,
    private getUrlParameters: (component: any) => AbstractModel[] = () => []
  ) {
    super();
    this.pageNumber = 0;
    this.filters = {};

    this.filterEvent$
      .pipe(
        debounceTime(defaultDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => this.getPageData(),
        // Filter event doesn't have an error output
        (err) => {}
      );
  }

  public ngOnInit() {
    if (this.route) {
      const models = retrieveResolvers(this.route.snapshot.data as PageInfo);
      if (!models) {
        this.failure = true;
        return;
      }
      this.models = models;
    }

    this.getPageData();
  }

  public setPage(pageInfo: TablePage) {
    this.pageNumber = pageInfo.offset;
    this.filters.paging = {
      page: pageInfo.offset + 1,
    };

    this.getPageData();
  }

  public onFilter(filter: string) {
    if (!filter) {
      this.filters.filter = undefined;
    } else {
      this.filters.filter = {
        // TODO Figure out how to get this typing working
        [this.filterKey as any]: { contains: filter },
      };
    }

    this.filterEvent$.next(filter);
  }

  public onSort(event: SortEvent) {
    if (!event.newValue) {
      this.filters.sorting = undefined;
    } else {
      this.filters.sorting = {
        orderBy: this.sortKeys[event.column.prop],
        direction: event.newValue,
      };
    }

    this.getPageData();
  }

  public getPageData() {
    this.loadingData = true;
    this.rows = [];

    this.apiAction(this.filters, this.getUrlParameters(this))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => {
          this.rows = this.rowsCallback(models);
          this.loadingData = false;

          if (models.length > 0) {
            const meta = models[0].getMetadata();
            this.totalModels = meta.paging.total;
          } else {
            this.totalModels = 0;
          }
        },
        (err: ApiErrorDetails) => {
          this.error = err;
          this.rows = undefined;
          this.loadingData = false;
        }
      );
  }

  protected apiAction(filters: Filters<M>, args: AbstractModel[]) {
    return this.api.filter(filters, ...args);
  }
}

// TODO Update keys to match API standards
export interface TablePage {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;
}

export interface SortEvent {
  newValue: "asc" | "desc";
  prevValue: "asc" | "desc";
  column: {
    sortable: boolean;
    prop: string;
    name: string;
  };
}
