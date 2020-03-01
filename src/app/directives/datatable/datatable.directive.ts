import {
  AfterContentInit,
  ElementRef,
  OnInit,
  Directive,
  Input
} from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Directive({
  selector: "[appDatatable]"
})
export class DatatableDirective implements OnInit, AfterContentInit {
  @Input() datatable: DatatableComponent;

  constructor(private datatableRef: ElementRef) {}

  ngOnInit(): void {
    this.datatableRef.nativeElement.classList.add("bootstrap");
  }

  ngAfterContentInit() {
    // Set Inputs
    this.datatable.footerHeight = 50;
    this.datatable.headerHeight = 50;
    this.datatable.limit = 25;
    this.datatable.rowHeight = "auto";
    this.datatable.scrollbarH = true;
    this.datatable.reorderable = false;
  }
}
