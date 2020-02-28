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
  templateUrl: "./datatable.component.html",
  styleUrls: ["./datatable.component.scss"]
})
export class DefaultDatatableComponent implements OnInit, AfterContentInit {
  @ContentChild(DatatableComponent) datatable: DatatableComponent;
  @ContentChild(DatatableComponent, { read: ElementRef })
  datatableRef: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit() {
    console.log(this.datatable);
    console.log(this.datatableRef);

    this.datatableRef.nativeElement.classList.add("bootstrap");
    this.datatable.footerHeight = 50;
    this.datatable.headerHeight = 50;
    this.datatable.limit = 25;
    this.datatable.rowHeight = "auto";
    this.datatable.scrollbarH = true;
  }
}
