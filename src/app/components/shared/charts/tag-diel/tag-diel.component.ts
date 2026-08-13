import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from "@angular/core";
import { Range } from "@baw-api/baw-api.service";
import { TagDielActivityReportItem } from "@models/Reports";
import { ChartComponent } from "@shared/chart/chart.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { Map as ImmutableMap } from "immutable";
import { createTagFormatter, resolveTags } from "../resolve-tags";
import chartSchema from "./tagDiel.schema.json";

interface TagDielChartRow {
  // seconds since midnight for the bucket's start and end
  readonly range: Range<number>;
  readonly tagId: number;
  readonly events: number;
}

export function flattenDielRows(
  rows: readonly TagDielActivityReportItem[],
): TagDielChartRow[] {
  return rows.flatMap(({ range, tags }) =>
    tags.map(({ tagId, events }) => ({ range, tagId, events })),
  );
}

@Component({
  selector: "baw-tag-diel",
  template: `
    @if (tags()) {
      <baw-chart
        #chart
        [spec]="chartSchema"
        [data]="chartRows()"
        [formatter]="tagFormatter"
        logContext="Tag diel activity"
      />
    } @else {
      <baw-loading />
    }
  `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent, LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagDielComponent {
  public readonly rows = input.required<TagDielActivityReportItem[]>();

  protected readonly tags = resolveTags(this.rows);
  protected readonly tagFormatter = createTagFormatter(this.tags);

  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartRows = computed(() => flattenDielRows(this.rows()));

  protected readonly chartSchema = ImmutableMap(chartSchema);
}
