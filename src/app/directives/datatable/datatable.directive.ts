import { Directive, ElementRef, Host, Input, OnInit } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Directive({
  selector: "[bawDatatableDefaults]"
})
export class DatatableDirective implements OnInit {
  @Input() externalPaging = true;
  @Input() externalSorting = true;
  @Input() footerHeight = 50;
  @Input() headerHeight = 50;
  @Input() limit = 25;
  @Input() reorderable = false;
  @Input() rowHeight: ((row: any) => number) | number | "auto" = "auto";
  @Input() scrollbarH = true;

  constructor(
    @Host() private datatable: DatatableComponent,
    private datatableRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Set class
    this.datatableRef.nativeElement.classList.add("bootstrap");

    // Set overrides
    this.datatable.externalPaging = this.externalPaging;
    this.datatable.externalSorting = this.externalSorting;
    this.datatable.footerHeight = this.footerHeight;
    this.datatable.headerHeight = this.headerHeight;
    this.datatable.limit = this.limit;
    this.datatable.reorderable = this.reorderable;
    this.datatable.rowHeight = this.rowHeight;
    this.datatable.scrollbarH = this.scrollbarH;
  }
}
