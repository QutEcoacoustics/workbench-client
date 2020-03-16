import { Directive, ElementRef, Host, Input, OnInit } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";

/**
 * Datatable default directives.
 * Assigns defaults to ngx-datatable element.
 */
@Directive({
  selector: "[bawDatatableDefaults]"
})
export class DatatableDirective implements OnInit {
  @Input() footerHeight = 50;
  @Input() headerHeight = 50;
  @Input() limit = 25;
  @Input() rowHeight: ((row: any) => number) | number | "auto" = "auto";
  @Input() scrollbarH = true;
  @Input() reorderable = false;

  constructor(
    @Host() private datatable: DatatableComponent,
    private datatableRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Set class
    this.datatableRef.nativeElement.classList.add("bootstrap");

    // Set overrides
    this.datatable.footerHeight = this.footerHeight;
    this.datatable.headerHeight = this.headerHeight;
    this.datatable.limit = this.limit;
    this.datatable.rowHeight = this.rowHeight;
    this.datatable.scrollbarH = this.scrollbarH;
    this.datatable.reorderable = this.reorderable;
  }
}
