import { BawApiService } from "@baw-api/baw-api.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AnalysisCoverageReportService } from "@baw-api/reports/event-report/analysis-coverage-report.service";
import { EventSummariesReportService } from "@baw-api/reports/event-report/event-summaries-report.service";
import { RecordingCoverageReportService } from "@baw-api/reports/event-report/recording-coverage-report.service";
import { TagAccumulationReportService } from "@baw-api/reports/event-report/tag-accumulation-report.service";
import { TagDielActivityReportService } from "@baw-api/reports/event-report/tag-diel-activity-report.service";
import { TagFrequencyReportService } from "@baw-api/reports/event-report/tag-frequency-report.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import {
  faPen,
  faChevronDown,
  faChevronUp,
  faFileArrowDown,
  faInfoCircle,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  ActivatedRouteStub,
  SpectatorRouting,
  createRoutingFactory,
  mockProvider,
} from "@ngneat/spectator";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateTag } from "@test/fakes/Tag";
import { ChartComponent } from "@shared/chart/chart.component";
import { MockComponent } from "ng-mocks";
import { of } from "rxjs";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { Tag } from "@models/Tag";
import { Chart } from "../AnnotationReportParameters";
import { ViewAnnotationReportComponent } from "./view.component";

describe("ViewAnnotationReportComponent", () => {
  let spectator: SpectatorRouting<ViewAnnotationReportComponent>;
  let modalService: NgbModal;
  let modalConfigService: NgbModalConfig;
  let iconLibrary: FaIconLibrary;
  let defaultProject: Project;
  let defaultRegion: Region;
  let eventSummariesFilterSpy: jasmine.Spy;
  let tagFrequencyFilterSpy: jasmine.Spy;
  let tagDielFilterSpy: jasmine.Spy;
  let tagAccumulationFilterSpy: jasmine.Spy;
  let recordingCoverageFilterSpy: jasmine.Spy;
  let analysisCoverageFilterSpy: jasmine.Spy;
  let tagShowSpy: jasmine.Spy;

  const createComponent = createRoutingFactory({
    component: ViewAnnotationReportComponent,
    shallow: true,
    declarations: [MockComponent(SiteMapComponent)],
    providers: [
      provideMockBawApi(),
      mockProvider(EventSummariesReportService, {
        filter: (...args: unknown[]) => eventSummariesFilterSpy(...args),
      }),
      mockProvider(TagFrequencyReportService, {
        filter: (...args: unknown[]) => tagFrequencyFilterSpy(...args),
      }),
      mockProvider(TagDielActivityReportService, {
        filter: (...args: unknown[]) => tagDielFilterSpy(...args),
      }),
      mockProvider(TagsService, {
        show: (...args: unknown[]) => tagShowSpy(...args),
      }),
      mockProvider(TagAccumulationReportService, {
        filter: (...args: unknown[]) => tagAccumulationFilterSpy(...args),
      }),
      mockProvider(RecordingCoverageReportService, {
        filter: (...args: unknown[]) => recordingCoverageFilterSpy(...args),
      }),
      mockProvider(AnalysisCoverageReportService, {
        filter: (...args: unknown[]) => analysisCoverageFilterSpy(...args),
      }),
      mockProvider(BawApiService, {
        encodeFilter: () => "filterEncoded=abc",
      }),
      mockProvider(SharedActivatedRouteService, {
        activatedRoute: of(
          new ActivatedRouteStub({
            params: { projectId: 1, regionId: 2 },
            queryParams: {},
            data: {},
          }),
        ),
      }),
    ],
  });

  function setup(
    queryParams = {
      bucketSize: "month",
      charts: Chart.coverage,
    },
  ): void {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          project: "resolver",
          region: "resolver",
        },
        project: { model: defaultProject },
        region: { model: defaultRegion },
      },
      queryParams,
    });

    modalService = spectator.inject(NgbModal);
    modalService.open = jasmine.createSpy("open");

    modalConfigService = spectator.inject(NgbModalConfig);
    modalConfigService.animation = false;

    const createUrlTree = spectator.component["router"].createUrlTree;
    if (jasmine.isSpy(createUrlTree)) {
      (createUrlTree as jasmine.Spy).and.returnValue({
        toString: () =>
          "/reports/annotations?charts=coverage,tag-frequency-stacked,tag-breakdown",
      } as never);
    } else {
      spyOn(spectator.component["router"], "createUrlTree").and.returnValue({
        toString: () =>
          "/reports/annotations?charts=coverage,tag-frequency-stacked,tag-breakdown",
      } as never);
    }

    iconLibrary = spectator.inject(FaIconLibrary);
    iconLibrary.addIcons(
      faPrint,
      faPen,
      faFileArrowDown,
      faInfoCircle,
      faChevronUp,
      faChevronDown,
    );

    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    tagShowSpy = jasmine
      .createSpy("tagShow")
      .and.returnValue(of(new Tag(generateTag({ id: 1, text: "Koala" }))));
    eventSummariesFilterSpy = jasmine
      .createSpy("eventSummariesFilter")
      .and.returnValue(of([]));
    tagFrequencyFilterSpy = jasmine
      .createSpy("tagFrequencyFilter")
      .and.returnValue(of([]));
    tagDielFilterSpy = jasmine
      .createSpy("tagDielFilter")
      .and.returnValue(of([]));
    tagAccumulationFilterSpy = jasmine
      .createSpy("tagAccumulationFilter")
      .and.returnValue(of([]));
    recordingCoverageFilterSpy = jasmine
      .createSpy("recordingCoverageFilter")
      .and.returnValue(of([]));
    analysisCoverageFilterSpy = jasmine
      .createSpy("analysisCoverageFilter")
      .and.returnValue(of([]));
    ChartComponent.resizeObserver = jasmine.createSpyObj("ResizeObserver", [
      "observe",
      "unobserve",
      "disconnect",
    ]);
    setup();
  });

  afterEach(() => {
    modalService.dismissAll();
    window.localStorage.clear();
    ChartComponent.resizeObserver = undefined;
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(ViewAnnotationReportComponent);
  });

  it("should load the base report endpoints", () => {
    expect(eventSummariesFilterSpy).toHaveBeenCalled();
    expect(recordingCoverageFilterSpy).toHaveBeenCalled();
    expect(analysisCoverageFilterSpy).toHaveBeenCalled();
    expect(tagFrequencyFilterSpy).toHaveBeenCalled();
    expect(tagDielFilterSpy).toHaveBeenCalled();
    expect(tagAccumulationFilterSpy).not.toHaveBeenCalled();
  });

  it("should serialize newly selected stacked and breakdown charts into the url", () => {
    const replaceStateSpy = spyOn(
      spectator.component["location"],
      "replaceState",
    ).and.callThrough();

    spectator.component["toggleChart"](Chart.tagFrequencyStacked, true);
    spectator.component["toggleChart"](Chart.tagBreakdown, true);

    expect(spectator.component.parameterDataModel.charts).toEqual([
      Chart.coverage,
      Chart.tagFrequencyStacked,
      Chart.tagBreakdown,
    ]);
    const sharedUrl = replaceStateSpy.calls.mostRecent().args[0] as string;
    expect(sharedUrl).toContain("coverage");
    expect(sharedUrl).toContain("tag-frequency-stacked");
    expect(sharedUrl).toContain("tag-breakdown");
  });
});
