import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from "@angular/core";
import { TagFrequencyReportItem } from "@models/Reports";
import { ChartComponent } from "@shared/chart/chart.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { Map as ImmutableMap } from "immutable";
import { createTagFormatter, resolveTags } from "../resolve-tags";
import chartSchema from "./speciesTimeSeries.schema.json";

export interface SpeciesTimeSeriesChartRow {
  readonly range: TagFrequencyReportItem["range"];
  readonly tagId: number;
  readonly events: number;
}

export function flattenFrequencyRows(
  rows: readonly TagFrequencyReportItem[],
): SpeciesTimeSeriesChartRow[] {
  // collect all tags ids so we can widen the sparse API data into a cartesian product of all ranges and all tags
  const tagIds = Array.from(
    rows
      .flatMap(({ tags }) => tags)
      .reduce((set, { tagId }) => set.add(tagId), new Set<number>()),
  );

  return rows.flatMap(({ range, tags }) => {
    const eventsByTag = new Map(
      tags.map(({ tagId, events }) => [tagId, events] as const),
    );

    return tagIds.map((tagId) => ({
      range,
      tagId,
      events: eventsByTag.get(tagId) ?? 0,
    }));
  });
}

@Component({
  selector: "baw-species-time-series",
  template: `
    @if (tags()) {
      <baw-chart
        #chart
        [spec]="chartSchema"
        [data]="chartRows()"
        [formatter]="tagFormatter"
        logContext="Tag frequency"
      />
    } @else {
      <baw-loading />
    }
  `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent, LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesTimeSeriesComponent {
  public readonly rows = input.required<TagFrequencyReportItem[]>();

  protected readonly tags = resolveTags(this.rows);
  protected readonly tagFormatter = createTagFormatter(this.tags);

  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartRows = computed(() =>
    flattenFrequencyRows(this.rows()),
  );

  protected readonly chartSchema = ImmutableMap(chartSchema);
}
