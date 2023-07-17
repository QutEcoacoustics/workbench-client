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

// this component exists for us to render vega-lite charts in an *ngFor loop
// render multiple charts using different dynamically updating data from the same schema
// and provide a unified error message format. All of the above cannot be done with vega-lite alone
@Component({
  selector: "baw-chart",
  template: `
    <ng-container *ngIf="data; else insufficientDataTemplate">
      <div #chartContainer style="height: 100%; width: 100%;">
        Chart loading
      </div>
    </ng-container>

    <ng-template #insufficientDataTemplate>
      Insufficient data to create chart
    </ng-template>
  `,
})
export class ChartComponent implements AfterViewInit {
  public constructor() {}

  @ViewChild("chartContainer") public element: ElementRef;

  // vega lite spec and data are the same object, therefore, by separating the two at the component level
  // we can create multiple graphs with different data from the same spec
  @Input() public spec;
  @Input() public data: Data;
  @Input() public options: EmbedOptions = { actions: false };

  private fullSpec: Immutable.Collection<VisualizationSpec, VisualizationSpec>;

  public ngAfterViewInit() {
    // since vega lite graphs are objects, we need to create the new component spec by value, rather than by reference
    // updating by reference will cause all other graphs to update as well
    this.fullSpec = Map({
      ...this.spec,
      data: {
        values: this.data,
      },
    });

    embed(
      this.element.nativeElement,
      this.fullSpec.toObject(),
      this.options
    );
  }
}
