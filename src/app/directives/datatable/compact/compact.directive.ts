import { Directive, ElementRef, OnInit, inject } from "@angular/core";
import { DatatableDefaultsDirective } from "../defaults/defaults.directive";

@Directive({ selector: "ngx-datatable[bawDatatableCompact]" })
export class DatatableCompactDirective extends DatatableDefaultsDirective implements OnInit {
  protected readonly datatableRef = inject(ElementRef);

  public ngOnInit(): void {
    this.datatableRef.nativeElement.classList.add("compact-datatable");
  }
}
