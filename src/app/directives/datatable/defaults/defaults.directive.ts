import { Directive, inject } from "@angular/core";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import {
  ColumnMode,
  DatatableComponent,
  SortType,
} from "@swimlane/ngx-datatable";

/**
 * Datatable default directives.
 * Assigns defaults to ngx-datatable element.
 *
 * ! This directive assumes that external paging and sorting is wanted. If they
 * are not required, set them to false, otherwise ngx-datatable will not
 * display your data
 */
@Directive({ selector: "ngx-datatable[bawDatatableDefaults]" })
export class DatatableDefaultsDirective {
  protected readonly datatable = inject(DatatableComponent, { host: true });

  public constructor() {
    // A Component/Directive's @Input attributes are processed after the
    // constructor and before the ngOnInit lifecycle hook is run.
    // This means that these constructor defaults, can be overwritten if the
    // user has explicitly overwritten any of these values in the ngx-datatable
    // @Input attributes.
    this.datatable.footerHeight = 50;
    this.datatable.headerHeight = 50;
    this.datatable.summaryHeight = 50;
    this.datatable.rowHeight = "auto";

    this.datatable.columnMode = ColumnMode.force;
    this.datatable.externalPaging = true;
    this.datatable.externalSorting = true;
    this.datatable.limit = defaultApiPageSize;
    this.datatable.reorderable = false;
    this.datatable.scrollbarH = true;
    this.datatable.sortType = SortType.single;
  }
}
