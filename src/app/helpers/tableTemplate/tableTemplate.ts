import { Directive, ViewChild } from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
  SortType,
  TableColumn
} from "@swimlane/ngx-datatable";
import { PageComponent } from "../page/pageComponent";

export abstract class TableTemplate<T> extends PageComponent {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Table variables
  public ColumnMode = ColumnMode;
  public SortType = SortType;
  public SelectionType = SelectionType;
  public columns: TableColumn[] = [];
  public rows: T[] = [];
  public temp: T[] = [];
  public tableClass = "bootstrap";
  public defaultTableLimit = 25;
  public headerHeight = 50;
  public footerHeight = 50;
  public selected: T[] = [];

  // State variable
  public ready: boolean;

  constructor(private filterMatch: (val: string, row: T) => boolean) {
    super();

    this.ready = false;
  }

  /**
   * Create table rows
   */
  protected abstract createRows(): void;

  /**
   * Update table with filtered results
   * @param $event Update event
   */
  public updateFilter($event: any): void {
    const val: string = $event.target.value;

    // filter our data
    const temp = this.temp.filter(row => {
      return !val || this.filterMatch(val, row);
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * Check if val contains field. Case insensitive.
   * @param filter Filter value
   * @param cell Cell value to compare
   */
  protected checkMatch(filter: string, cell: string | null): boolean {
    if (!cell) {
      return false;
    }

    return cell.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1;
  }

  /**
   * Load table rows
   */
  protected loadTable() {
    this.createRows();
    this.temp = [...this.rows];
    this.ready = true;
  }
}

export interface TablePage {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;
}
