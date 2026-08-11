import { Map } from "immutable";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from "@angular/core";
import { ChartComponent } from "@shared/chart/chart.component";
import { Param } from "@interfaces/apiInterfaces";
import { TagAccumulationItem } from "@models/Reports";
import chartSchema from "./speciesAccumulationCurve.schema.json";

export interface SpeciesAccumulationGraphData {
  date: Param;
  count: number;
  error: number;
}

@Component({
  selector: "baw-species-accumulation-curve",
  template: `
    <baw-chart #chart [spec]="chartSchema" [data]="data()" />
 `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesAccumulationCurveComponent {
  public readonly rows = input.required<TagAccumulationItem[]>();
  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly data = computed(() =>
    this.rows().map((item) => ({
      date: getBucketStart(item),
      count: item.cumulativeUniqueTagCount,
      error: 0,
    })),
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
