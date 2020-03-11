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
  public pageNumber: number;
  public totalModels: number;

  // State variables
  public loadingData: boolean;
  public error: ApiErrorDetails;

  constructor(
    private api: ApiFilter<any, any>,
    private rowsCallback: (models: M[]) => T[]
  ) {
    super();
  }

  public setPage(pageInfo: TablePage) {
    this.pageNumber = pageInfo.offset;
    this.getModels(pageInfo.offset);
  }

  public getModels(page: number = 0) {
    this.loadingData = true;
    this.rows = [];

    this.api
      .filter({ paging: { page: page + 1 } })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        models => {
          this.rows = this.rowsCallback(models);
          this.loadingData = false;

          if (models.length > 0) {
            const meta = models[0].getMetadata();
            this.pageNumber = meta.paging.page - 1;
            this.totalModels = meta.paging.total;
          } else {
            this.pageNumber = 0;
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
