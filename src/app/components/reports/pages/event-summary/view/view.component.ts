import {
  DecimalPipe,
  Location,
  PercentPipe,
  TitleCasePipe,
} from "@angular/common";
import {
  Component,
  HostListener,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { IdOr } from "@baw-api/api-common";
import { BawApiService, Filters, InnerFilter } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import {
  ProjectsService,
  projectResolvers,
} from "@baw-api/project/projects.service";
import {
  RegionsService,
  regionResolvers,
} from "@baw-api/region/regions.service";
import { AnalysisCoverageReportService } from "@baw-api/reports/event-report/analysis-coverage-report.service";
import { EventSummariesReportService } from "@baw-api/reports/event-report/event-summaries-report.service";
import { RecordingCoverageReportService } from "@baw-api/reports/event-report/recording-coverage-report.service";
import { TagAccumulationReportService } from "@baw-api/reports/event-report/tag-accumulation-report.service";
import { TagDielActivityReportService } from "@baw-api/reports/event-report/tag-diel-activity-report.service";
import { TagFrequencyReportService } from "@baw-api/reports/event-report/tag-frequency-report.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { SitesService, siteResolvers } from "@baw-api/site/sites.service";
import {
  reportCategories,
  reportMenuItems,
} from "@components/reports/reports.menu";
import { UrlDirective } from "@directives/url/url.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { filterAnd } from "@helpers/filters/filters";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AssociationInjector } from "@models/ImplementsInjector";
import { Project } from "@models/Project";
import { IAudioEventSummaryReportStatistics } from "@models/Provenance/ReportStatistics";
import { Region } from "@models/Region";
import {
  AnalysisCoverageItem,
  AudioRecordingCoverageItem,
  SupportedDielBucketSize,
  SupportedTagBucketSize,
} from "@models/Reports";
import { Site } from "@models/Site";
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { DateTimePipe } from "@pipes/date/date.pipe";
import { TimePipe } from "@pipes/time/time.pipe";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { ConfidencePlotComponent } from "@shared/charts/confidence-plot/confidence-plot.component";
import { CoveragePlotComponent } from "@shared/charts/coverage-plot/coverage-plot.component";
import { DielPlotComponent } from "@shared/charts/diel-plot/diel-plot.component";
import { SpeciesAccumulationCurveComponent } from "@shared/charts/species-accumulation-curve/species-accumulation-curve.component";
import { SpeciesCompositionGraphComponent } from "@shared/charts/species-composition/species-composition.component";
import { SpeciesTimeSeriesComponent } from "@shared/charts/species-time-series/species-time-series.component";
import { DatetimeComponent } from "@shared/datetime-formats/datetime/datetime/datetime.component";
import { DurationComponent } from "@shared/datetime-formats/duration/duration.component";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { DateTime, Duration } from "luxon";
import { filter, switchMap, take } from "rxjs";
import { SiteMapComponent } from "../../../../projects/components/site-map/site-map.component";
import { CollapsibleSectionComponent } from "../../../components/collapsible-section/collapsible-section.component";
import {
  BucketSize,
  Chart,
  EventSummaryReportParameters,
} from "../EventSummaryReportParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const coverageBucketCount = 100;
const dielBucketSize: SupportedDielBucketSize = "hour";

const allCharts = [
  Chart.coverage,
  Chart.eventSummary,
  Chart.speciesCompositionCurve,
  Chart.speciesAccumulationCurve,
  Chart.speciesTimeSeries,
  Chart.dielPlot,
];

@Component({
  selector: "baw-summary-report",
  templateUrl: "./view.component.html",
  styleUrl: "./view.component.scss",
  imports: [
    NgbTooltip,
    FaIconComponent,
    DatetimeComponent,
    InlineListComponent,
    SiteMapComponent,
    DurationComponent,
    DecimalPipe,
    PercentPipe,
    TitleCasePipe,
    TimePipe,
    DateTimePipe,
    UrlDirective,
    LoadingComponent,
    ConfidencePlotComponent,
    CoveragePlotComponent,
    DielPlotComponent,
    SpeciesAccumulationCurveComponent,
    SpeciesCompositionGraphComponent,
    SpeciesTimeSeriesComponent,
    CollapsibleSectionComponent,
  ],
})
class ViewEventReportComponent extends PageComponent {
  protected readonly eventSummariesApi = inject(EventSummariesReportService);
  protected readonly tagAccumulationApi = inject(TagAccumulationReportService);
  protected readonly tagDielActivityApi = inject(TagDielActivityReportService);
  protected readonly tagFrequencyApi = inject(TagFrequencyReportService);
  protected readonly analysisCoverageApi = inject(
    AnalysisCoverageReportService,
  );
  protected readonly recordingCoverageApi = inject(
    RecordingCoverageReportService,
  );
  protected readonly session = inject(BawSessionService);
  protected readonly associationInjector =
    inject<AssociationInjector>(ASSOCIATION_INJECTOR);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly modalService = inject(NgbModal);
  private readonly projectApi = inject(ProjectsService);
  private readonly regionApi = inject(RegionsService);
  private readonly siteApi = inject(SitesService);
  private readonly api = inject<BawApiService<any>>(BawApiService);
  private readonly models = retrieveResolvers(
    this.route.snapshot.data as IPageInfo,
  );

  public readonly project = this.models[projectKey] as Project;
  public readonly region = this.models[regionKey] as Region | undefined;
  public readonly site = this.models[siteKey] as Site | undefined;
  public readonly parameterDataModel = createParameterDataModel(
    this.route.snapshot.queryParams,
    this.associationInjector,
  );

  private readonly audioEventFilters = scopeFilters(
    this.parameterDataModel.toAudioEventFilter(),
    this.project,
    this.region,
    this.site,
  );
  private readonly audioRecordingFilters = scopeFilters(
    this.parameterDataModel.toAudioRecordingFilter(),
    this.project,
    this.region,
    this.site,
  );
  private readonly selectedBucketSize = toSupportedBucketSize(
    this.parameterDataModel.bucketSize,
  );
  private readonly selectedCharts = signal<Chart[] | null>(
    this.parameterDataModel.charts ?? null,
  );
  private readonly accumulationRequested = signal(
    this.shouldShowChart(Chart.speciesAccumulationCurve),
  );

  protected readonly filteredSites = this.resolveFilteredSites();
  protected readonly generatedDate = DateTime.now().toISO() ?? "";
  protected readonly eventSummaries = toSignal(
    this.eventSummariesApi.filter(this.audioEventFilters),
  );
  protected readonly recordingCoverage = toSignal(
    this.recordingCoverageApi.filter(
      this.audioRecordingFilters,
      coverageBucketCount,
    ),
  );
  protected readonly analysisCoverage = toSignal(
    this.analysisCoverageApi.filter(
      this.audioRecordingFilters,
      coverageBucketCount,
    ),
  );
  protected readonly tagFrequency = toSignal(
    this.tagFrequencyApi.filter(
      this.audioEventFilters,
      this.selectedBucketSize,
    ),
  );
  protected readonly dielActivity = toSignal(
    this.tagDielActivityApi.filter(this.audioEventFilters, dielBucketSize),
  );
  protected readonly accumulation = toSignal(
    toObservable(this.accumulationRequested).pipe(
      filter(Boolean),
      take(1),
      switchMap(() =>
        this.tagAccumulationApi.filter(
          this.audioEventFilters,
          this.selectedBucketSize,
        ),
      ),
    ),
  );
  protected readonly statistics = computed(() => {
    const recordingCoverage = this.recordingCoverage();
    const analysisCoverage = this.analysisCoverage();

    return recordingCoverage && analysisCoverage
      ? buildStatistics(
          recordingCoverage,
          analysisCoverage,
          this.parameterDataModel,
        )
      : undefined;
  });
  private readonly detectionFrequencyByTag = computed(() => {
    const tagFrequency = this.tagFrequency();
    if (!tagFrequency || tagFrequency.length === 0) {
      return new Map<number, number>();
    }

    const detectedBuckets = new Map<number, number>();
    for (const bucket of tagFrequency) {
      for (const tag of bucket.tags) {
        detectedBuckets.set(
          tag.tagId,
          (detectedBuckets.get(tag.tagId) ?? 0) + 1,
        );
      }
    }

    return new Map(
      Array.from(detectedBuckets, ([tagId, count]) => [
        tagId,
        count / tagFrequency.length,
      ]),
    );
  });

  protected readonly chartTypes = Chart;
  public readonly printingModal =
    viewChild.required<TemplateRef<unknown>>("printingModal");
  public readonly accumulationChart =
    viewChild<SpeciesAccumulationCurveComponent>("accumulationChart");
  public readonly compositionChart =
    viewChild<SpeciesCompositionGraphComponent>("compositionChart");
  public readonly timeSeriesChart =
    viewChild<SpeciesTimeSeriesComponent>("timeSeriesChart");
  public readonly dielChart = viewChild<DielPlotComponent>("dielChart");

  // we override ctrl + P (most browsers default for window.print shortcut) so we can show a help modal
  @HostListener("document:keydown", ["$event"])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === "p") {
      event.preventDefault();
      this.openPrintModal();
    }
  }

  protected downloadEventsTableUrl(): string {
    const selectedTimezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

    const baseUrl = this.site
      ? this.siteApi.downloadAnnotations(
          this.site,
          this.project,
          selectedTimezone,
        )
      : this.region
        ? this.regionApi.downloadAnnotations(
            this.region,
            this.project,
            selectedTimezone,
          )
        : this.projectApi.downloadAnnotations(this.project, selectedTimezone);

    return `${baseUrl}&${this.api.encodeFilter(this.audioEventFilters, true)}`;
  }

  protected openPrintModal(): void {
    if (this.shouldUsePrintModal()) {
      this.modalService.open(this.printingModal());
    } else {
      this.printPage();
    }
  }

  // we have to declare a function like this because we can't call window.print() from an angular template
  protected printPage(): void {
    window.print();
  }

  protected shouldUsePrintModal(): boolean {
    return localStorage.getItem("hidePrintModal") === null;
  }

  protected changePrintModalPreference(shouldHide: boolean): void {
    if (shouldHide) {
      localStorage.setItem("hidePrintModal", "true");
    } else {
      localStorage.removeItem("hidePrintModal");
    }
  }

  protected unixEpochToDuration(unixEpoch: number): Duration {
    return Duration.fromMillis(unixEpoch * 1000);
  }

  protected bucketsWithDetections(tagId: number): number {
    return this.detectionFrequencyByTag().get(tagId) ?? 0;
  }

  protected downloadAccumulationChart(): void {
    this.accumulationChart()?.chart().downloadChartAsCsv();
  }

  protected downloadCompositionChart(): void {
    this.compositionChart()?.chart().downloadChartAsCsv();
  }

  protected downloadTimeSeriesChart(): void {
    this.timeSeriesChart()?.chart().downloadChartAsCsv();
  }

  protected downloadDielChart(): void {
    this.dielChart()?.chart().downloadChartAsCsv();
  }

  private resolveFilteredSites(): IdOr<Site>[] {
    if ((this.parameterDataModel.siteModels?.length ?? 0) > 0) {
      return this.parameterDataModel.siteModels!;
    }

    if ((this.parameterDataModel.regionModels?.length ?? 0) > 0) {
      return this.parameterDataModel.regionModels!.flatMap((region) =>
        Array.from(region.siteIds ?? []),
      );
    }

    if (this.site) {
      return [this.site];
    } else if (this.region) {
      return Array.from(this.region.siteIds ?? []);
    }

    return Array.from(this.project.siteIds ?? []);
  }

  protected shouldShowChart(chart: Chart): boolean {
    return this.selectedCharts()?.includes(chart) ?? true;
  }

  protected toggleChart(chart: Chart, show: boolean): void {
    const currentCharts = this.selectedCharts() ?? allCharts;
    const updatedCharts = show
      ? Array.from(new Set([...currentCharts, chart]))
      : currentCharts.filter((item) => item !== chart);
    const serializedCharts =
      updatedCharts.length === allCharts.length ? null : updatedCharts;

    this.selectedCharts.set(serializedCharts);
    this.parameterDataModel.charts = serializedCharts!;

    if (chart === Chart.speciesAccumulationCurve && show) {
      this.accumulationRequested.set(true);
    }

    this.updateQueryStringParameters();
  }

  private updateQueryStringParameters(): void {
    const queryParams = this.parameterDataModel.toQueryParams();
    const urlTree = this.router.createUrlTree([], { queryParams });
    this.location.replaceState(urlTree.toString());
  }
}

function getPageInfo(subRoute: keyof typeof reportMenuItems.view): IPageInfo {
  return {
    pageRoute: reportMenuItems.view[subRoute],
    category: reportCategories.view[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

ViewEventReportComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { ViewEventReportComponent };

function createParameterDataModel(
  queryParams: Record<string, unknown>,
  associationInjector: AssociationInjector,
): EventSummaryReportParameters {
  const parameters = new EventSummaryReportParameters(
    queryParams,
    associationInjector,
  );
  const supportedBucketSizes = new Set<BucketSize>([
    BucketSize.day,
    BucketSize.week,
    BucketSize.month,
    BucketSize.year,
  ]);
  if (!supportedBucketSizes.has(parameters.bucketSize)) {
    parameters.bucketSize = BucketSize.month;
  }

  return parameters;
}

function toSupportedBucketSize(bucketSize: BucketSize): SupportedTagBucketSize {
  switch (bucketSize) {
    case BucketSize.day:
    case BucketSize.week:
    case BucketSize.month:
    case BucketSize.year:
      return bucketSize;
    default:
      return BucketSize.month;
  }
}

function scopeFilters<T>(
  filters: Filters<T>,
  project: Project,
  region?: Region,
  site?: Site,
): Filters<T> {
  const scopedFilter = applyRouteScope(filters.filter, project, region, site);

  return {
    ...filters,
    filter: scopedFilter,
  };
}

function applyRouteScope<T>(
  filter: InnerFilter<T> | undefined,
  project: Project,
  region?: Region,
  site?: Site,
): InnerFilter<T> {
  if (site) {
    return filterAnd(filter ?? {}, {
      "sites.id": { in: [site.id] },
    } as InnerFilter<T>) as InnerFilter<T>;
  }

  if (region) {
    return filterAnd(filter ?? {}, {
      "regions.id": { in: [region.id] },
    } as InnerFilter<T>) as InnerFilter<T>;
  }

  return filterAnd(filter ?? {}, {
    "projects.id": { in: [project.id] },
  } as InnerFilter<T>) as InnerFilter<T>;
}

function buildStatistics(
  recordingCoverage: AudioRecordingCoverageItem[],
  analysisCoverage: AnalysisCoverageItem[],
  parameters: EventSummaryReportParameters,
): IAudioEventSummaryReportStatistics {
  const firstRecording = extractCoverageRange(recordingCoverage[0])?.[0];
  const lastRecording = extractCoverageRange(
    recordingCoverage[recordingCoverage.length - 1],
  )?.[1];

  const start =
    parameters.dateStartedAfter?.toISO() ?? firstRecording?.toISO() ?? "";
  const end =
    parameters.dateFinishedBefore?.toISO() ?? lastRecording?.toISO() ?? "";

  const totalSearchSpan =
    start && end
      ? Math.max(
          0,
          Math.round(
            DateTime.fromISO(end).diff(DateTime.fromISO(start), "seconds")
              .seconds,
          ),
        )
      : 0;

  return {
    totalSearchSpan,
    audioCoverageOverSpan: sumCoveredSeconds(recordingCoverage),
    analysisCoverageOverSpan: sumCoveredSeconds(
      analysisCoverage.filter((item) => item.result === "success"),
    ),
    countOfRecordingsAnalyzed: analysisCoverage.length,
    coverageStartDay: start,
    coverageEndDay: end,
  };
}

function sumCoveredSeconds(
  rows: Array<Pick<AudioRecordingCoverageItem, "density"> & CoverageRangeLike>,
): number {
  return Math.round(
    rows.reduce((total, row) => {
      const range = extractCoverageRange(row);
      if (!range) {
        return total;
      }

      const [start, end] = range;
      const spanSeconds = Math.max(0, end.diff(start, "seconds").seconds);

      return total + spanSeconds * row.density;
    }, 0),
  );
}

type CoverageRangeValue = string | Date | DateTime;

interface CoverageRangeLike {
  range?: [CoverageRangeValue, CoverageRangeValue];
  coverage?: [CoverageRangeValue, CoverageRangeValue];
}

function extractCoverageRange(
  row: CoverageRangeLike | undefined,
): [DateTime, DateTime] | null {
  if (!row) {
    return null;
  }

  const range = row.range ?? row.coverage;
  if (!range) {
    return null;
  }

  return [toDateTime(range[0]), toDateTime(range[1])];
}

function toDateTime(value: CoverageRangeValue): DateTime {
  if (DateTime.isDateTime(value)) {
    return value;
  }

  if (value instanceof Date) {
    return DateTime.fromJSDate(value);
  }

  return DateTime.fromISO(value);
}
