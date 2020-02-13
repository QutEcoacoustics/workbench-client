import { ViewChild } from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SortType
} from "@swimlane/ngx-datatable";
import { PageComponent } from "../page/pageComponent";

export abstract class ListTemplate<T> extends PageComponent {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  // Table variables
  public ColumnMode = ColumnMode;
  public SortType = SortType;
  public columns: { name?: string; prop?: string }[];
  public rows: T[];
  public temp: T[];
  public tableClass = "bootstrap";
  public defaultTableLimit = 25;
  public headerHeight = 50;
  public footerHeight = 50;

  constructor(private filterMatch: (val: string, row: T) => boolean) {
    super();
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
  }
}
