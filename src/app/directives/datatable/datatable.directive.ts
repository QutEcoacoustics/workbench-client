import { Directive, ElementRef, Host, Input, OnInit } from '@angular/core';
import { defaultApiPageSize } from '@baw-api/baw-api.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

/**
 * Datatable default directives.
 * Assigns defaults to ngx-datatable element.
 */
@Directive({
  selector: '[bawDatatableDefaults]',
})
export class DatatableDirective implements OnInit {
  @Input() public externalPaging = true;
  @Input() public externalSorting = true;
  @Input() public footerHeight = 50;
  @Input() public headerHeight = 50;
  @Input() public limit = defaultApiPageSize;
  @Input() public reorderable = false;
  @Input() public rowHeight: ((row: any) => number) | number | 'auto' = 'auto';
  @Input() public scrollbarH = true;

  constructor(
    @Host() private datatable: DatatableComponent,
    private datatableRef: ElementRef
  ) {}

  public ngOnInit(): void {
    // Set class
    this.datatableRef.nativeElement.classList.add('bootstrap');

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
