import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import embed from "vega-embed";
import { Data } from "vega-lite/build/src/data";

@Component({
  selector: "baw-chart",
  template: `
    <div #chartContainer class="w-100 h-100">
      Insufficient data to create graph
    </div>
  `,
})
export class ChartComponent implements AfterViewInit {
  public constructor() {}

  @ViewChild("chartContainer") public element: ElementRef;

  @Input() public spec;
  @Input() public data: Data;

  public ngAfterViewInit() {
    const fullSpec = this.spec;
    fullSpec.data.values = this.data;

    embed(this.element.nativeElement, fullSpec);
  }
}
