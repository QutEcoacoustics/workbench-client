import { Directive, ElementRef, Host, OnInit } from "@angular/core";
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

  public ngOnInit(): void {
    super.ngOnInit();

    this.datatableRef.nativeElement.classList.add("compact-datatable");
  }
}
