import { Directive, Host, Input, OnChanges } from "@angular/core";
import { DataTableColumnDirective } from "@swimlane/ngx-datatable";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[sortKey]",
})
export class DatatableSortKeyDirective implements OnChanges {
  @Input() public sortKey: string;

  public constructor(@Host() private column: DataTableColumnDirective<any>) {}

  public ngOnChanges(): void {
    // We use the square bracket notation that bypasses type checking because
    // the sortKey is custom property that we add to ngx-datatable columns that
    // does not exist on the normal column type definition.
    // We use this sortKey property inside of our custom pagination.directive
    this.column["sortKey"] = this.sortKey;
  }
}
