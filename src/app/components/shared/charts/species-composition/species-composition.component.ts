import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from "@angular/core";
import { Id, Param } from "@interfaces/apiInterfaces";
import { TagFrequencyReportItem } from "@models/Reports";
import { Tag } from "@models/Tag";
import { ChartComponent } from "@shared/chart/chart.component";
import { Map } from "immutable";
import chartSchema from "./speciesCompositionCurve.schema.json";

export interface SpeciesCompositionGraphData {
  date: Param;
  tagId: Id<Tag>;
  ratio: number;
}

@Component({
  selector: "baw-species-composition-graph",
  template: `
    <baw-chart
      #chart
      [spec]="chartSchema"
      [data]="data()"
      [formatter]="formatter()"
    />
 `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesCompositionGraphComponent {
  public readonly rows = input.required<TagFrequencyReportItem[]>();
  public readonly formatter = input.required<(tagId: unknown) => string>();

  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly data = computed(() =>
    this.rows().flatMap((row) => {
      const total = row.tags.reduce((sum, tag) => sum + tag.events, 0);
      const date = getBucketStart(row);

      return row.tags.map((tag) => ({
        date,
        tagId: tag.tagId,
        ratio: total === 0 ? 0 : tag.events / total,
      }));
    }),
  );

  protected readonly chartSchema = Map(chartSchema);
}

function getBucketStart(item: {
  range?: [unknown, unknown];
  bucket?: [unknown, unknown];
}): Param {
  const range = item.range ?? item.bucket;
  return serializeBucketValue(range?.[0]);
}

function serializeBucketValue(value: unknown): Param {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === "object" && "toISO" in value) {
    const toIso = (value as { toISO?: () => string | null }).toISO;
    if (typeof toIso === "function") {
      return toIso.call(value) ?? "";
    }
  }

  return String(value ?? "");
}
