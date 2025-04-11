import { Directive, ElementRef, Host, Input, OnInit } from "@angular/core";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { ColumnMode, DatatableComponent, SortType } from "@swimlane/ngx-datatable";

/**
 * Datatable default directives.
 * Assigns defaults to ngx-datatable element.
 *
 * ! This directive assumes that external paging and sorting is wanted. If they
 * are not required, set them to false, otherwise ngx-datatable will not
 * display your data
 */
@Directive({
  selector: "[bawDatatableDefaults]",
  standalone: false,
})
export class DatatableDefaultsDirective implements OnInit {
  @Input() public externalPaging = true;
  @Input() public externalSorting = true;
  @Input() public footerHeight = 50;
  @Input() public headerHeight = 50;
  @Input() public summaryHeight = 50;
  @Input() public limit = defaultApiPageSize;
  @Input() public reorderable = false;
  @Input() public rowHeight: ((row: any) => number) | number | "auto" = "auto";
  @Input() public scrollbarH = true;
  @Input() public sortType = SortType.single;

  public constructor(
    @Host() private datatable: DatatableComponent,
    private datatableRef: ElementRef,
  ) {}

  public ngOnInit(): void {
    // Set class
    this.datatableRef.nativeElement.classList.add("bootstrap");

    // Set overrides
    this.datatable.columnMode = ColumnMode.force;
    this.datatable.externalPaging = this.externalPaging;
    this.datatable.externalSorting = this.externalSorting;
    this.datatable.footerHeight = this.footerHeight;
    this.datatable.headerHeight = this.headerHeight;
    this.datatable.summaryHeight = this.summaryHeight;
    this.datatable.limit = this.limit;
    this.datatable.reorderable = this.reorderable;
    this.datatable.rowHeight = this.rowHeight;
    this.datatable.scrollbarH = this.scrollbarH;
    this.datatable.sortType = this.sortType;
  }
}
