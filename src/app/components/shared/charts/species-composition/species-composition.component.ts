import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from "@angular/core";
import { Range } from "@baw-api/baw-api.service";
import { TagFrequencyReportItem } from "@models/Reports";
import { ChartComponent } from "@shared/chart/chart.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { Map as ImmutableMap } from "immutable";
import { DateTime } from "luxon";
import { createTagFormatter, resolveTags } from "../resolve-tags";
import chartSchema from "./speciesCompositionCurve.schema.json";

interface SpeciesCompositionChartRow {
  readonly range: Range<DateTime>;
  readonly tagId: number;
  readonly events: number;
  readonly ratio: number;
}

export function flattenCompositionRows(
  rows: readonly TagFrequencyReportItem[],
): SpeciesCompositionChartRow[] {
  // collect all tags ids so we can widen the sparse API data into a cartesian product of all ranges and all tags
  const tagIds = Array.from(
    rows
      .flatMap(({ tags }) => tags)
      .reduce((set, { tagId }) => set.add(tagId), new Set<number>()),
  );

  return rows.flatMap(({ range, tags }) => {
    const eventsByTag = new Map<number, number>();
    let totalEventsThisRange = 0;
    for (const { tagId, events } of tags) {
      totalEventsThisRange += events;

      if (eventsByTag.has(tagId)) {
        // shouldn't happen just checking while debugging
        throw new Error(`Duplicate tagId ${tagId} found in range ${range}`);
      }

      eventsByTag.set(tagId, events);
    }

    // for every bucket emit every tag for a consistent tabular data shape
    return tagIds.map((tagId) => {
      const events = eventsByTag.get(tagId) ?? 0;
      const ratio =
        totalEventsThisRange === 0 ? 0 : events / totalEventsThisRange;
      return { range, tagId, events, ratio };
    });
  });
}

@Component({
  selector: "baw-species-composition-graph",
  template: `
    @if (tags()) {
      <baw-chart
        #chart
        [spec]="chartSchema"
        [data]="chartRows()"
        [formatter]="tagFormatter"
        logContext="Species composition"
      />
    } @else {
      <baw-loading />
    }
  `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent, LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesCompositionGraphComponent {
  public readonly rows = input.required<TagFrequencyReportItem[]>();

  protected readonly tags = resolveTags(this.rows);
  protected readonly tagFormatter = createTagFormatter(this.tags);

  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartRows = computed(() =>
    flattenCompositionRows(this.rows()),
  );

  protected readonly chartSchema = ImmutableMap(chartSchema);
}
