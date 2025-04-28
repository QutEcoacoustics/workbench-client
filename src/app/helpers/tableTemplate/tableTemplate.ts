import { Directive, ViewChild } from "@angular/core";
import { Option } from "@helpers/advancedTypes";
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
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class TableTemplate<T> extends PageComponent {
  @ViewChild(DatatableComponent) public table: DatatableComponent;

  // Table variables
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ColumnMode = ColumnMode;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public SortType = SortType;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public SelectionType = SelectionType;
  public columns: TableColumn[] = [];
  public rows: T[];
  public filterTempRows: T[];
  public selected: T[] = [];

  public constructor(private filterMatch: (val: string, row: T) => boolean) {
    super();
  }

  /**
   * Create table rows
   */
  protected abstract createRows(): void;

  /**
   * Update table with filtered results
   *
   * @param $event Update event
   */
  public updateFilter($event: any): void {
    const val: string = $event.target.value;

    // filter our data
    const temp = this.filterTempRows.filter(
      (row) => !val || this.filterMatch(val, row)
    );

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * Check if val contains field. Case insensitive.
   *
   * @param filter Filter value
   * @param cell Cell value to compare
   */
  protected checkMatch(filter: string, cell: Option<string>): boolean {
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
