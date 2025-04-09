import { Directive, Host, Input, OnChanges } from "@angular/core";
import { DataTableColumnDirective } from "@swimlane/ngx-datatable";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[sortKey]",
  standalone: false
})
export class DatatableSortKeyDirective implements OnChanges {
  @Input() public sortKey: string;

  public constructor(@Host() private column: DataTableColumnDirective) {}

  public ngOnChanges(): void {
    this.column["sortKey"] = this.sortKey;
  }
}
