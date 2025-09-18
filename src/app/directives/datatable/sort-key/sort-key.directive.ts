import { Directive, Host, OnChanges, input } from "@angular/core";
import { DataTableColumnDirective } from "@swimlane/ngx-datatable";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[sortKey]",
})
export class DatatableSortKeyDirective implements OnChanges {
  public readonly sortKey = input<string>(undefined);

  public constructor(@Host() private column: DataTableColumnDirective) {}

  public ngOnChanges(): void {
    this.column["sortKey"] = this.sortKey();
  }
}
