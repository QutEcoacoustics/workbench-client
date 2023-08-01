import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import { Data } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import embed, {
  EmbedOptions,
  ExpressionFunction,
  Result,
  VisualizationSpec,
  vega,
} from "vega-embed";
import { Datasets } from "vega-lite/build/src/spec/toplevel";

const customFormatterName = "customFormatter";

// this component exists for us to render vega-lite charts in an *ngFor loop
// render multiple charts using different dynamically updating data from the same schema
// and provide a unified error message format. All of the above cannot be done with vega-lite alone
@Component({
  selector: "baw-chart",
  template: `
    <div
      #chartContainer
      class="chartContainer marks"
      (window:resize)="resizeEvent()"
      (window:beforeprint)="resizeEvent()"
      (window:afterprint)="resizeEvent()"
    >
      Chart loading
    </div>
  `,
  styleUrls: ["chart.component.scss"],
})
export class ChartComponent implements AfterViewInit {
  public constructor(
    private deviceDetector: DeviceDetectorService
  ) {}

  @ViewChild("chartContainer") public element: ElementRef;

  // vega lite spec and data are the same object, therefore, by separating the two at the component level
  // we can create multiple graphs with different data from the same spec
  // we use an immutablejs object because the only way to recreate a graph is to destroy it and recreate it
  // we therefore don't allow it to be updated with change detection or through an RxJS observable
  //! look at https://vega.github.io/vega-lite/tutorials/streaming.html to double check if we can implement this
  @Input() public spec: Immutable.Collection<unknown, unknown>;
  /** A single data input */
  @Input() public data?: Data;
  /**
   * Allows for multiple disjoint data sources
   * If your spec contains multiple graphs concatenated in one spec, use multiple dataset as it allows multiple data sources for one chart
   * If your spec contains one graph, use the `[data]` attribute instead
   */
  @Input() public datasets?: Datasets;
  @Input() public options?: EmbedOptions = { actions: false };
  /**
   * Specifies a way to turn model values into user-facing values
   * e.g. turn a model id into its model name
   *
   * @link https://vega.github.io/vega/docs/expressions/#expression-functions
   * @link https://vega.github.io/vega-lite/docs/config.html#custom-format-type
   *
   * @example
   * ```typescript
   * const vegaProjectNameFormatter = (projectId: Id) =>
   *    this.projects.find((project: Project) => project.id === projectId);
   * ```
   */
  @Input() public formatter?: (item: unknown) => string;

  private vegaView: Result;
  private vegaFormatterFunction: ExpressionFunction;

  public async ngAfterViewInit() {
    const defaultOptions: EmbedOptions = {
      // we always want to use svg as the renderer (unless unless explicitly overridden in the options) as it has sharper text
      // svg is currently buggy on Firefox (Window's) and results in bad rendered text https://bugzilla.mozilla.org/show_bug.cgi?id=1747705
      // therefore, we need to use canvas if the user is on Firefox
      renderer: this.isFirefox() ? "canvas" : "svg"
    };

    if (this.formatter) {
      this.vegaFormatterFunction = vega.expressionFunction(
        customFormatterName,
        (datum: unknown) => this.formatter(datum)
      );
    }

    // since vega lite graphs are objects, we need to create the new component spec by value, rather than by reference
    // updating by reference will cause all other graphs to update as well
    const fullSpec: VisualizationSpec = this.addDataToSpec(
      this.spec,
      this.datasets,
      this.data
    );

    this.vegaView = await embed(this.element.nativeElement, fullSpec, {
      ...defaultOptions,
      ...this.options,
    });

    if (this.formatter) {
      this.vegaView.embedOptions.expressionFunctions = {
        [`${customFormatterName}`]: this.vegaFormatterFunction,
      };
    }
  }

  // this is triggered by the window.resize event, which will trigger on all browsers when the window or container is resized
  // this event will also trigger when printing, causing the graphs to fit to the page
  protected resizeEvent(): void {
    // it is possible to trigger the resize event before the vega chart is embedded
    // this will cause this component to throw an error and have no effect/benefits
    if (this.vegaView) {
      this.vegaView.view.resize();
      this.vegaView.view.run();
    }
  }

  private isFirefox(): boolean {
    return this.deviceDetector.browser === "Firefox";
  }

  private addDataToSpec(
    spec,
    datasets = undefined,
    data = undefined
  ): VisualizationSpec {
    if (this.datasets) {
      return {
        ...spec.toObject(),
        datasets,
      };
    } else if (this.data) {
      return {
        ...spec.toObject(),
        data: {
          values: data,
        },
      };
    } else {
      return spec.toObject();
    }
  }
}
