import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  OnInit
} from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-datatable",
  template: `
    <ng-content class="bootstrap"></ng-content>
  `
})
export class DefaultDatatableComponent implements OnInit, AfterContentInit {
  @ContentChild(DatatableComponent) datatable: DatatableComponent;
  @ContentChild(DatatableComponent, { read: ElementRef })
  datatableRef: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit() {
    // Set Class
    this.datatableRef.nativeElement.classList.add("bootstrap");

    // Set Inputs
    this.datatable.footerHeight = 50;
    this.datatable.headerHeight = 50;
    this.datatable.limit = 25;
    this.datatable.rowHeight = "auto";
    this.datatable.scrollbarH = true;
    this.datatable.reorderable = false;
  }
}
