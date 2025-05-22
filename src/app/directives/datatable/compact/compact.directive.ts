import { Directive, ElementRef, Host, input, OnInit } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "../defaults/defaults.directive";

@Directive({ selector: "ngx-datatable[bawDatatableCompact]" })
export class DatatableCompactDirective extends DatatableDefaultsDirective implements OnInit {
  public constructor(
    @Host() protected datatable: DatatableComponent,
    protected datatableRef: ElementRef
  ) {
    super(datatable, datatableRef);
  }

  public headerHeight = input(50);
  public footerHeight = input(50);
  public summaryHeight = input(50);
  public rowHeight = input<DatatableComponent["rowHeight"]>("auto");

  public ngOnInit(): void {
    super.ngOnInit();

    this.datatableRef.nativeElement.classList.add("compact-datatable");
  }
}
