import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";
import { loadBrowserVega } from "#baw/vega-runtime";
import {
  TagDielActivityReportItem,
  TagFrequencyReportItem,
} from "@models/Reports";
import { ChartComponent } from "@shared/chart/chart.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { Map as ImmutableMap } from "immutable";
import { createTagFormatter, resolveTags } from "../resolve-tags";
import { flattenDielRows } from "../tag-diel/tag-diel.component";
import { flattenFrequencyRows } from "../tag-frequency/tag-frequency.component";
import dielChartSchema from "./tagBreakdownDiel.schema.json";
import frequencyChartSchema from "./tagBreakdownFrequency.schema.json";

const defaultColor = "#1f77b4";
const tagColorScheme = "category10";
type SchemeProvider = { scheme: (name: string) => unknown };

function resolveTagColors(vega: SchemeProvider): string[] {
  const scheme = vega.scheme(tagColorScheme);

  if (!Array.isArray(scheme) || scheme.length === 0) {
    return [defaultColor];
  }

  const colors = scheme.filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );
  return colors.length > 0 ? colors : [defaultColor];
}

@Component({
  selector: "baw-tag-breakdown",
  template: `
    @if (tags() && isColorSchemeReady()) {
      <div class="tag-breakdown">
        @for (tagId of orderedTagIds(); track tagId) {
          <section class="tag-breakdown-row">
            <h5 class="tag-label">{{ tagFormatter(tagId) }}</h5>

            <div class="chart-frame frequency-frame">
              <baw-chart
                [spec]="frequencyChartSchema"
                [data]="frequencyRowsByTag().get(tagId) ?? []"
                [params]="compactChartParams()"
                [formatter]="tagFormatter"
                logContext="Tag breakdown frequency"
              />
            </div>

            <div class="chart-frame diel-frame">
              <baw-chart
                [spec]="dielChartSchema"
                [data]="dielRowsByTag().get(tagId) ?? []"
                [params]="compactChartParams()"
                [formatter]="tagFormatter"
                logContext="Tag breakdown diel"
              />
            </div>
          </section>
        }
      </div>
    } @else {
      <baw-loading />
    }
  `,
  styleUrl: "./tag-breakdown.component.scss",
  imports: [ChartComponent, LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagBreakdownComponent {
  public readonly frequencyRows = input.required<TagFrequencyReportItem[]>();
  public readonly dielRows = input.required<TagDielActivityReportItem[]>();
  protected readonly isColorSchemeReady = signal(false);
  private readonly tagColors = signal<string[]>([defaultColor]);

  public constructor() {
    this.initializeTagColors();
  }

  private readonly rowsForTagResolution = computed(() => [
    ...this.frequencyRows(),
    ...this.dielRows(),
  ]);

  protected readonly tags = resolveTags(this.rowsForTagResolution);
  protected readonly tagFormatter = createTagFormatter(this.tags);

  protected readonly orderedTagIds = computed(() => {
    const tagIds = new Set<number>();

    for (const { tagId } of flattenFrequencyRows(this.frequencyRows())) {
      tagIds.add(tagId);
    }

    for (const { tagId } of flattenDielRows(this.dielRows())) {
      tagIds.add(tagId);
    }

    return Array.from(tagIds);
  });

  protected readonly frequencyRowsByTag = computed(() =>
    groupByTag(
      flattenFrequencyRows(this.frequencyRows()).map((row) => ({
        ...row,
        color: this.normalizeColor(this.colorForTag(row.tagId)),
      })),
    ),
  );

  protected readonly dielRowsByTag = computed(() =>
    groupByTag(
      flattenDielRows(this.dielRows()).map((row) => ({
        ...row,
        color: this.normalizeColor(this.colorForTag(row.tagId)),
      })),
    ),
  );

  protected readonly compactChartParams = computed(() => ({
    bawTitleSize: 14,
    bawFontSize: 11,
  }));

  protected readonly frequencyChartSchema = ImmutableMap(
    frequencyChartSchema as object,
  );
  protected readonly dielChartSchema = ImmutableMap(dielChartSchema as object);

  private colorForTag(tagId: number): string {
    const tagIndex = this.orderedTagIds().indexOf(tagId);
    const index = tagIndex >= 0 ? tagIndex : 0;
    const tagColors = this.tagColors();
    return tagColors[index % tagColors.length] ?? defaultColor;
  }

  private normalizeColor(value: unknown): string {
    return typeof value === "string" && value.trim().length > 0
      ? value
      : defaultColor;
  }

  private initializeTagColors(): void {
    loadBrowserVega()
      .then(({ vega }) => {
        this.tagColors.set(resolveTagColors(vega));
        this.isColorSchemeReady.set(true);
      })
      .catch(() => {
        this.tagColors.set([defaultColor]);
        this.isColorSchemeReady.set(true);
      });
  }
}

function groupByTag<T extends { readonly tagId: number }>(
  rows: readonly T[],
): Map<number, T[]> {
  const groupedRows = new Map<number, T[]>();

  for (const row of rows) {
    const existingRows = groupedRows.get(row.tagId);

    if (existingRows) {
      existingRows.push(row);
    } else {
      groupedRows.set(row.tagId, [row]);
    }
  }

  return groupedRows;
}
