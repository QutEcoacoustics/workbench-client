import { ViewChild } from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
  SortType,
  TableColumn
} from "@swimlane/ngx-datatable";
import { takeUntil } from "rxjs/operators";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiFilter } from "src/app/services/baw-api/api-common";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { PageComponent } from "../page/pageComponent";
import { Filters } from "src/app/services/baw-api/baw-api.service";

export abstract class PagedTableTemplate<
  T,
  M extends AbstractModel
> extends PageComponent {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Table variables
  public ColumnMode = ColumnMode;
  public SortType = SortType;
  public SelectionType = SelectionType;
  public columns: TableColumn[] = [];
  public rows: T[];
  public selected: T[] = [];
  public sortKeys: { [key: string]: string };
  public totalModels: number;

  // State variables
  public loadingData: boolean;
  public error: ApiErrorDetails;
  protected filters: Filters;

  constructor(
    private api: ApiFilter<any, any>,
    private rowsCallback: (models: M[]) => T[]
  ) {
    super();
    this.filters = {};
  }

  public setPage(pageInfo: TablePage) {
    this.filters.paging = {
      page: pageInfo.offset + 1
    };
    this.getModels();
  }

  public onFilter(filter: string) {
    console.log("Filter Event", filter);

    // TODO Call getModels with text filter
  }

  public onSort(event: SortEvent) {
    this.filters.sorting = {
      orderBy: this.sortKeys[event.column.prop],
      direction: event.newValue
    };

    this.getModels();
  }

  public getModels() {
    this.loadingData = true;
    this.rows = [];

    console.log("Filters: ", this.filters);

    this.api
      .filter(this.filters)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        models => {
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
}

export interface TablePage {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;
}

interface SortEvent {
  newValue: "asc" | "desc";
  prevValue: "asc" | "desc";
  column: {
    sortable: boolean;
    prop: string;
    name: string;
  };
}
