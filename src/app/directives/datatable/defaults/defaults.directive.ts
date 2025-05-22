import { Directive, ElementRef, Host, input, OnInit } from "@angular/core";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import {
  ColumnMode,
  DatatableComponent,
  SortType,
} from "@swimlane/ngx-datatable";
import { DatatableConfig } from "../datatableConfig";

/**
 * Datatable default directives.
 * Assigns defaults to ngx-datatable element.
 *
 * ! This directive assumes that external paging and sorting is wanted. If they
 * are not required, set them to false, otherwise ngx-datatable will not
 * display your data
 */
@Directive({ selector: "ngx-datatable[bawDatatableDefaults]" })
export class DatatableDefaultsDirective extends DatatableConfig implements OnInit {
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

  public externalPaging = input(true);
  public externalSorting = input(true);
  public limit = input(defaultApiPageSize);
  public reorderable = input(false);
  public scrollbarH = input(true);
  public sortType = input(SortType.single);

  public ngOnInit(): void {
    super.ngOnInit();

    this.datatable.columnMode = ColumnMode.force;
    this.datatable.externalPaging = this.externalPaging();
    this.datatable.externalSorting = this.externalSorting();
    this.datatable.limit = this.limit();
    this.datatable.reorderable = this.reorderable();
    this.datatable.scrollbarH = this.scrollbarH();
    this.datatable.sortType = this.sortType();
  }
}
