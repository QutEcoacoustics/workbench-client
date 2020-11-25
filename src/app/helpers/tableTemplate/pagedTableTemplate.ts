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
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { defaultDebounceTime } from "src/app/app.helper";
import { PageComponent } from "../page/pageComponent";

/**
 * Paged Template Class.
 * Handles creating all the generic logic required for a datatable containing component
 * which requires the use of external sorting and paging.
 */
@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class PagedTableTemplate<TableRow, M extends AbstractModel>
  extends PageComponent
  implements OnInit {
  @ViewChild(DatatableComponent) public table: DatatableComponent;

  // Table variables
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ColumnMode = ColumnMode;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public SortType = SortType;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public SelectionType = SelectionType;
  public columns: TableColumn[] = [];
  public rows: TableRow[];
  public selected: TableRow[] = [];
  public sortKeys: { [key: string]: string };
  public filterKey: keyof M;
  public totalModels = 0;
  public pageSize = 0;

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

  public constructor(
    protected api: ApiFilter<any, any>,
    private rowsCallback: (models: M[]) => TableRow[],
    private route?: ActivatedRoute,
    private getUrlParameters: (component: any) => AbstractModel[] = () => [],
    private preselectRows: (rows: TableRow[]) => void = () => {}
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
        orderBy: this.sortKeys[event.column.prop] as keyof M,
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
        (models: M[]) => {
          this.rows = this.rowsCallback(models);
          this.preselectRows(this.rows);
          this.loadingData = false;

          this.pageSize = models.length;
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

  protected apiAction(filters: Filters<M>, args: AbstractModel[] = []) {
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
