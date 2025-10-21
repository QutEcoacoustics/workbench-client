import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { Map } from "immutable";
import coveragePlotSchema from "./coveragePlot.schema.json";
import { ChartComponent, ChartData } from "@shared/chart/chart.component";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { Filters } from "@baw-api/baw-api.service";

@Component({
  selector: "baw-audio-coverage-map",
  template: `<baw-chart [spec]="coveragePlotSchema" [data]="data()" />`,
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverageMapComponent {
  public readonly filters = input.required<Filters<EventSummaryReport>>();

  protected readonly data = computed<ChartData>(() => {});

  protected readonly coveragePlotSchema = Map(coveragePlotSchema);
}
