import { Directive, ElementRef, Host, InputSignal, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Directive()
export abstract class DatatableConfig implements OnInit, OnChanges {
  public constructor(
    @Host() protected datatable: DatatableComponent,
    protected datatableRef: ElementRef
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    console.debug(changes, this.datatable.footerHeight);
  }

  public abstract headerHeight: InputSignal<number>;
  public abstract footerHeight: InputSignal<number>;
  public abstract summaryHeight: InputSignal<number>;
  public abstract rowHeight: InputSignal<DatatableComponent["rowHeight"]>;

  public ngOnInit(): void {
    this.datatable.footerHeight = this.footerHeight();
    this.datatable.headerHeight = this.headerHeight();
    this.datatable.summaryHeight = this.summaryHeight();

    this.datatable.rowHeight = this.rowHeight();
  }
}
