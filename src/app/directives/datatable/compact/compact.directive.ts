import { Directive, ElementRef, Host, OnInit } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "../defaults/defaults.directive";

@Directive({ selector: "ngx-datatable[bawDatatableCompact]" })
export class DatatableCompactDirective extends DatatableDefaultsDirective implements OnInit {
  public constructor(
    @Host() protected datatable: DatatableComponent,
    protected datatableRef: ElementRef
  ) {
    super(datatable);
  }

  public ngOnInit(): void {
    this.datatableRef.nativeElement.classList.add("compact-datatable");
  }
}
