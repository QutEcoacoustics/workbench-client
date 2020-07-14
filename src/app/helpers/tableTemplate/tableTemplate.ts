import { Directive, Injectable, ViewChild } from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
  SortType,
  TableColumn,
} from "@swimlane/ngx-datatable";
import { PageComponent } from "../page/pageComponent";

/**
 * Table Template Class.
 * Handles creating all the generic logic required for a simple datatable containing component.
 */
@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class TableTemplate<T> extends PageComponent {
  @ViewChild(DatatableComponent) public table: DatatableComponent;

  // Table variables
  public ColumnMode = ColumnMode;
  public SortType = SortType;
  public SelectionType = SelectionType;
  public columns: TableColumn[] = [];
  public rows: T[];
  public filterTempRows: T[];
  public selected: T[] = [];

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
    const temp = this.filterTempRows.filter((row) => {
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
    this.filterTempRows = [...this.rows];
  }
}
