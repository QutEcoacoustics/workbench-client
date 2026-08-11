import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from "@angular/core";
import { Histogram } from "@baw-api/baw-api.service";
import { ChartComponent } from "@shared/chart/chart.component";
import { Map } from "immutable";
import chartSchema from "./confidencePlot.schema.json";

@Component({
  selector: "baw-confidence-plot",
  template: `
    @if (hasData()) {
      <baw-chart
        #chart
        [spec]="chartSchema"
        [datasets]="datasets()"
        [params]="params()"
      />
    }
  `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfidencePlotComponent {
  public readonly histogram = input.required<Histogram | null>();
  public readonly chart = viewChild<ChartComponent>("chart");

  protected readonly hasData = computed(
    () => (this.histogram()?.bucketCount ?? 0) > 0,
  );

  protected readonly params = computed(() => {
    const histogram = this.histogram();

    return {
      minimum: histogram?.minimum ?? 0,
      midpoint: histogram ? (histogram.minimum + histogram.maximum) / 2 : 0,
      maximum: histogram?.maximum ?? 0,
    };
  });

  protected readonly datasets = computed(() => {
    const histogram = this.histogram();
    const baseBins = histogram?.toChartSequence() ?? [];

    const histogramData = baseBins.map((bin) => ({
      panel: "histogram",
      ...bin,
      bucketLabel: `${bin.range[0].toFixed(2)} to ${bin.range[1].toFixed(2)}`,
      overflowLabel: null,
    }));

    const underflowCount = histogram?.underflow ?? 0;
    const overflowCount = histogram?.overflow ?? 0;

    // for the underflow we generate two values.
    // The inner value is the same as the respective outer histogram bin, and the outer value is the over/under flow count.
    // We do this to show a "trend" style line from the histogram to the over/under flow count.
    const underflowData = [
      { edge: 0, count: underflowCount },
      { edge: 1, count: baseBins[0]?.count ?? 0 },
    ].map(({ edge, count }) => ({
      panel: "underflow",
      edge,
      count,
      outOfRangeCount: underflowCount,
      bucketLabel: `Below ${histogram?.minimum.toFixed(2) ?? "minimum"}`,
      overflowLabel: "Underflow",
    }));

    const overflowData = [
      { edge: 0, count: baseBins[baseBins.length - 1]?.count ?? 0 },
      { edge: 1, count: overflowCount },
    ].map(({ edge, count }) => ({
      panel: "overflow",
      edge,
      count,
      outOfRangeCount: overflowCount,
      bucketLabel: `Above ${histogram?.maximum.toFixed(2) ?? "maximum"}`,
      overflowLabel: "Overflow",
    }));

    return {
      histogram: [...underflowData, ...histogramData, ...overflowData],
    };
  });
  protected readonly chartSchema = Map(chartSchema);
}
