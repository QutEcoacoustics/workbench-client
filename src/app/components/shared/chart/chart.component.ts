import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import { Data } from "@angular/router";
import { Map } from "immutable";
import embed, { EmbedOptions, VisualizationSpec } from "vega-embed";
import { Datasets } from "vega-lite/build/src/spec/toplevel";

// this component exists for us to render vega-lite charts in an *ngFor loop
// render multiple charts using different dynamically updating data from the same schema
// and provide a unified error message format. All of the above cannot be done with vega-lite alone
@Component({
  selector: "baw-chart",
  template: `
    <div #chartContainer style="height: 100%; width: 100%;">
      Chart loading
    </div>
  `,
})
export class ChartComponent implements AfterViewInit {
  public constructor() {}

  @ViewChild("chartContainer") public element: ElementRef;

  // vega lite spec and data are the same object, therefore, by separating the two at the component level
  // we can create multiple graphs with different data from the same spec
  @Input() public spec;
  /** A single data input */
  @Input() public data?: Data;
  /**
   * Allows for multiple disjoint data sources
   * If your spec contains multiple graphs concatenated in one spec, use multiple dataset as it allows multiple data sources for one chart
   * If your spec contains one graph, use the `[data]` attribute instead
   */
  @Input() public datasets?: Datasets;
  @Input() public options?: EmbedOptions = { actions: false };

  private fullSpec: Immutable.Collection<VisualizationSpec, VisualizationSpec>;

  public ngAfterViewInit() {
    // since vega lite graphs are objects, we need to create the new component spec by value, rather than by reference
    // updating by reference will cause all other graphs to update as well

    if (this.datasets) {
      this.fullSpec = Map({
        ...this.spec,
        datasets: this.datasets
      });
    } else if (this.data) {
      this.fullSpec = Map({
        ...this.spec,
        data: {
          values: this.data,
        },
      });
    } else {
      this.fullSpec = Map(this.spec);
    }

    embed(
      this.element.nativeElement,
      this.fullSpec.toObject(),
      this.options
    );
  }
}
