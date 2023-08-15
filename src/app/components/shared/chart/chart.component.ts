import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import { Data } from "@angular/router";
import embed, {
  EmbedOptions,
  ExpressionFunction,
  Result,
  VisualizationSpec,
  vega,
} from "vega-embed";
import { Datasets } from "vega-lite/build/src/spec/toplevel";

const customFormatterName = "customFormatter";

// this component exists so we can render vega-lite charts in an *ngFor loop
// and use the same schema to render multiple charts with different data
// and provide a unified error message format. All of the above cannot be done with vega-lite alone
@Component({
  selector: "baw-chart",
  template: `
    <div
      #chartContainer
      class="chartContainer marks"
      (window:beforeprint)="resizeEvent()"
      (window:afterprint)="resizeEvent()"
    >
      Chart loading
    </div>
  `,
  styleUrls: ["chart.component.scss"],
})
export class ChartComponent implements AfterViewInit {
  public constructor() {}

  @ViewChild("chartContainer") public element: ElementRef;

  // in vega lite the spec and data are the same object, therefore, by separating the two at the component level
  // we can create multiple graphs with different data from the same spec
  // we use an immutablejs object because the only way to recreate a graph is to destroy it and recreate it
  // we therefore don't allow it to be updated with change detection or through an RxJS observable
  @Input() public spec: Immutable.Collection<string, string | object>;
  /** A single data set */
  @Input() public data?: Data;
  /**
   * Allows for multiple disjoint data sources
   * If your spec contains multiple graphs concatenated in one spec, use multiple dataset as it allows multiple data sources for one chart
   * If your spec contains one graph, use the `[data]` attribute instead
   */
  @Input() public datasets?: Datasets | object;
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
    // default options exist because they are always applied for compatibility reasons and cannot be overwritten by the @Input() options
    const defaultOptions: EmbedOptions = {
      // we always want to use svg as the renderer (unless unless explicitly overridden in the options) as it has sharper text
      // svg is currently buggy on Windows Firefox and results in poorly rendered text https://bugzilla.mozilla.org/show_bug.cgi?id=1747705
      renderer: "svg",
      config: {
        // for optimization reason, reactive sizing is disabled by default
        // however we enable it so that the graph will resize when the window resizes
        autosize: {
          type: "fit",
          resize: true,
        },
      },
    };

    if (this.formatter) {
      console.log("I AM HERE I AM HERE");
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
      expressionFunctions: {
        [`${customFormatterName}`]: this.vegaFormatterFunction ?? {},
      },
    });

    // we need to use a resize observer because if the chart is not visible on load, the width and height will be 0
    // but vega lite's autosize will only update when the window is resized
    // therefore, we also need to trigger a resize event when the component is resized
    const observer = new ResizeObserver(() => this.resizeEvent());
    observer.observe(this.element.nativeElement);
  }

  public async downloadChartAsCsv(): Promise<void> {
    if (this.vegaView) {
      // TODO: call an api endpoint to download the chart as CSV
    } else {
      console.error(
        "Failed to download vega-lite chart as CSV. Chart is not loaded or does not exist."
      );
    }
  }

  // this is triggered by the window.resize event, which will trigger on all browsers when the window or container is resized
  // this event will also trigger when printing, causing the graphs to fit to the page
  public resizeEvent(): void {
    // it is possible to trigger the resize event before the vega chart is embedded
    // this will cause this component to throw an error and have no effect/benefits
    if (this.vegaView) {
      // vega resize events are linked to window:resize events
      // however, we want to resize the vega lite charts when the component (not the window) is resized
      // therefore, we trigger a window:resize event when the component is resized
      // using the vega-embed resize event will work asynchronously, meaning that it will not resize the chart when printing
      window.dispatchEvent(new Event("resize"));
    }
  }

  // because data is inherently a field on the vega lite spec, but is separated in our component
  // we have to retroactively add the data to the spec as part of this component
  // we keep the data and the spec separate so that we can create multiple graphs with different data from the same spec
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
