import { Directive, Host, Input, OnInit } from "@angular/core";
import { DataTableColumnDirective } from "@swimlane/ngx-datatable";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "ngx-datatable-column",
  exportAs: "baw-datatable-column",
})
export class DatatableColumnDirective implements OnInit {
  @Input() public sortKey: string;

  public constructor(@Host() private datatable: DataTableColumnDirective) {}

  public ngOnInit(): void {
    this.datatable["sortKey"] = this.sortKey ?? this.datatable.prop.toString();
  }
}
