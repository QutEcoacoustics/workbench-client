import { Directive, ElementRef, Host, OnInit } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Directive({ selector: "ngx-datatable[bawDatatableCompact]" })
export class DatatableCompactDirective implements OnInit {
  public constructor(
    @Host() protected datatable: DatatableComponent,
    protected datatableRef: ElementRef
  ) {}

  public ngOnInit(): void {
    this.datatableRef.nativeElement.classList.add("compact-datatable");
  }
}
