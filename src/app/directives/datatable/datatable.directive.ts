import {
  AfterContentInit,
  Directive,
  ElementRef,
  Host,
  Input,
  OnInit
} from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Directive({
  selector: "[bawDatatableDefaults]"
})
export class DatatableDirective implements OnInit, AfterContentInit {
  @Input() footerHeight = 50;
  @Input() headerHeight = 50;
  @Input() limit = 25;
  @Input() rowHeight: ((row: any) => number) | number | "auto" = "auto";
  @Input() scrollbarH = true;
  @Input() reorderable = false;

  private datatableConfig: Partial<DatatableComponent>;

  constructor(
    @Host() private datatable: DatatableComponent,
    private datatableRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Set class
    this.datatableRef.nativeElement.classList.add("bootstrap");

    // Set overrides
    this.datatableConfig = {};
    this.datatableConfig.footerHeight = this.footerHeight;
    this.datatableConfig.headerHeight = this.headerHeight;
    this.datatableConfig.limit = this.limit;
    this.datatableConfig.rowHeight = this.rowHeight;
    this.datatableConfig.scrollbarH = this.scrollbarH;
    this.datatableConfig.reorderable = this.reorderable;
  }

  ngAfterContentInit() {
    for (const key of Object.keys(this.datatableConfig)) {
      this.datatable[key] = this.datatableConfig[key];
    }
  }
}
