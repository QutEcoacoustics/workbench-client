import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Data } from "@angular/router";
import { Map } from "immutable";
import embed, { EmbedOptions, ExpressionFunction, Result, VisualizationSpec } from "vega-embed";
import { Datasets } from "vega-lite/build/src/spec/toplevel";

// this component exists for us to render vega-lite charts in an *ngFor loop
// render multiple charts using different dynamically updating data from the same schema
// and provide a unified error message format. All of the above cannot be done with vega-lite alone
@Component({
  selector: "baw-chart",
  template: `
    <div #chartContainer class="chartContainer" (window:resize)="resizeEvent()">
      Chart loading
    </div>
  `,
  styleUrls: ["chart.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  @Input() public options?: EmbedOptions = {
    actions: false,
    renderer: "svg",
  };
  /**
   * Specifies a way to turn model values into user-facing values
   * e.g. turn a model id into its model name
   *
   * @link https://vega.github.io/vega/docs/expressions/#expression-functions
   * @link https://vega.github.io/vega-lite/docs/config.html#custom-format-type
   *
   * @example
   * ```typescript
   * vega.expressionFunction('customFormatA', function(datum, params) {
   *   ...
   *   return "<formatted string>";
   * });
   * ```
   */
 @Input() public formatter: ExpressionFunction;

  private fullSpec: Immutable.Collection<VisualizationSpec, VisualizationSpec>;
  private vegaView: Result;

  public async ngAfterViewInit() {
    // since vega lite graphs are objects, we need to create the new component spec by value, rather than by reference
    // updating by reference will cause all other graphs to update as well
    if (this.datasets) {
      this.fullSpec = Map({
        ...this.spec,
        datasets: this.datasets,
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

    this.vegaView = await embed(
      this.element.nativeElement,
      this.fullSpec.toObject(),
      this.options
    );

    this.vegaView.embedOptions.expressionFunctions = {
      customFormatter: this.formatter,
    };
  }

  // using vega-lite "width: container" doesn't update correctly when the window is resized
  // eg. If the window resizes from smaller to larger, charts will grow slightly. Repeated will result in a chart larger than its container
  // this is triggered by the window.resize event, which will trigger on all browsers when the window or container is resized
  // however, this event will trigger on Firefox when printing, but not chromium based browsers (chrome, edge, etc...)
  // therefore, we need to add another event listener for the print event
  protected resizeEvent(): void {
    this.vegaView.view.resize();
    this.vegaView.view.run();
  }
}
