import { Directive, Host, Input, OnChanges } from "@angular/core";
import { DataTableColumnDirective } from "@swimlane/ngx-datatable";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[sortKey]",
})
export class DatatableColumnDirective implements OnChanges {
  @Input() public sortKey: string;

  public constructor(@Host() private datatable: DataTableColumnDirective) {}

  public ngOnChanges(): void {
    this.datatable["sortKey"] = this.sortKey;
  }
}
