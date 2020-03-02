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
  selector: "[appDatatable]"
})
export class DatatableDirective implements OnInit, AfterContentInit {
  @Input() defaults: Partial<DatatableComponent>;
  private datatableConfig: Partial<DatatableComponent>;

  constructor(
    @Host() private datatable: DatatableComponent,
    private datatableRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.datatableRef.nativeElement.classList.add("bootstrap");

    this.datatableConfig = Object.assign(
      {
        footerHeight: 50,
        headerHeight: 50,
        limit: 25,
        rowHeight: "auto",
        scrollbarH: true,
        reorderable: false
      },
      this.defaults
    );
  }

  ngAfterContentInit() {
    for (const key of Object.keys(this.datatableConfig)) {
      this.datatable[key] = this.datatableConfig[key];
    }
  }
}
