import { Directive, Input, OnChanges, inject } from "@angular/core";
import { DataTableColumnDirective } from "@swimlane/ngx-datatable";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[sortKey]",
})
export class DatatableSortKeyDirective implements OnChanges {
  private readonly column = inject(DataTableColumnDirective, { host: true });

  @Input() public sortKey: string;

  public ngOnChanges(): void {
    this.column["sortKey"] = this.sortKey;
  }
}
