import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import embed, { EmbedOptions } from "vega-embed";
import { Data } from "vega-lite/build/src/data";

@Component({
  selector: "baw-chart",
  template: `
    <div #chartContainer style="height: 100%; width: 100%;">
      Loading...
    </div>
  `,
})
export class ChartComponent implements AfterViewInit {
  public constructor() {}

  @ViewChild("chartContainer") public element: ElementRef;

  @Input() public spec;
  @Input() public data: Data;
  @Input() public options: EmbedOptions;

  public ngAfterViewInit() {
    const fullSpec = this.spec;
    fullSpec.data.values = this.data;

    embed(
      this.element.nativeElement,
      fullSpec,
      this.options
    );
  }
}
