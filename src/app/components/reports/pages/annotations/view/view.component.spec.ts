import { BawApiService } from "@baw-api/baw-api.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AnalysisCoverageReportService } from "@baw-api/reports/event-report/analysis-coverage-report.service";
import { EventSummariesReportService } from "@baw-api/reports/event-report/event-summaries-report.service";
import { RecordingCoverageReportService } from "@baw-api/reports/event-report/recording-coverage-report.service";
import { TagAccumulationReportService } from "@baw-api/reports/event-report/tag-accumulation-report.service";
import { TagFrequencyReportService } from "@baw-api/reports/event-report/tag-frequency-report.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faFileArrowDown,
  faInfoCircle,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { EventSummaryItem } from "@models/Reports";
import { Tag } from "@models/Tag";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  SpectatorRouting,
  createRoutingFactory,
  mockProvider,
} from "@ngneat/spectator";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateTag } from "@test/fakes/Tag";
import { generateAnnotationReportUrlParams } from "@test/fakes/data/AnnotationReportParameters";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { MockComponent } from "ng-mocks";
import { NEVER, of } from "rxjs";
import {
  Chart,
  AnnotationReportParameters,
} from "../AnnotationReportParameters";
import { ViewAnnotationReportComponent } from "./view.component";

describe("ViewAnnotationReportComponent", () => {
  let spectator: SpectatorRouting<ViewAnnotationReportComponent>;
  let modalService: NgbModal;
  let modalConfigService: NgbModalConfig;
  let iconLibrary: FaIconLibrary;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultParameterDataModel: AnnotationReportParameters;
  let tagFrequencyFilterSpy: jasmine.Spy;
  let tagShowSpy: jasmine.Spy;
  let tagAccumulationFilterSpy: jasmine.Spy;
  let recordingCoverageFilterSpy: jasmine.Spy;
  let analysisCoverageFilterSpy: jasmine.Spy;
  const mockSiteMap = MockComponent(SiteMapComponent);
  const mockEventSummaries: EventSummaryItem[] = [];
  const mockTagFrequency = [
    {
      bucket: ["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"] as [
        string,
        string,
      ],
      tags: [{ tagId: 1, events: 2 }],
    },
  ];
  const mockAccumulation = [
    {
      bucket: ["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"] as [
        string,
        string,
      ],
      cumulativeUniqueTagCount: 1,
    },
  ];
  const mockRecordingCoverage = [
    {
      siteId: 1,
      coverage: ["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"] as [
        string,
        string,
      ],
      density: 1,
      gapThreshold: 1,
    },
  ];
  const mockAnalysisCoverage = [
    {
      siteId: 1,
      coverage: ["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"] as [
        string,
        string,
      ],
      density: 1,
      gapThreshold: 1,
      result: "success" as const,
    },
  ];

  const createComponent = createRoutingFactory({
    component: ViewAnnotationReportComponent,
    declarations: [mockSiteMap],
    providers: [
      provideMockBawApi(),
      mockProvider(EventSummariesReportService, {
        filter: (...args: unknown[]) => eventSummariesFilterSpy(...args),
      }),
      mockProvider(TagFrequencyReportService, {
        filter: (...args: unknown[]) => tagFrequencyFilterSpy(...args),
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
    ],
  });

  function setup(
    queryParams = generateAnnotationReportUrlParams({
      charts: Chart.speciesCompositionCurve,
      bucketSize: "month",
    }),
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

    iconLibrary = spectator.inject(FaIconLibrary);
    iconLibrary.addIcons(
      faPrint,
      faFileArrowDown,
      faInfoCircle,
      faChevronUp,
      faChevronDown,
    );

    spectator.detectChanges();
    defaultParameterDataModel = spectator.component.parameterDataModel;
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    eventSummariesFilterSpy = jasmine
      .createSpy("eventSummariesFilter")
      .and.returnValue(of(mockEventSummaries));
    tagFrequencyFilterSpy = jasmine
      .createSpy("tagFrequencyFilter")
      .and.returnValue(of(mockTagFrequency));
    tagShowSpy = jasmine
      .createSpy("tagShow")
      .and.returnValue(of(new Tag(generateTag({ id: 1, text: "Koala" }))));
    tagAccumulationFilterSpy = jasmine
      .createSpy("tagAccumulationFilter")
      .and.returnValue(of(mockAccumulation));
    recordingCoverageFilterSpy = jasmine
      .createSpy("recordingCoverageFilter")
      .and.returnValue(of(mockRecordingCoverage));
    analysisCoverageFilterSpy = jasmine
      .createSpy("analysisCoverageFilter")
      .and.returnValue(of(mockAnalysisCoverage));
    setup();
  });

  afterEach(() => {
    modalService.dismissAll();
    window.localStorage.clear();
  });

  const printButtonElement = (): HTMLAnchorElement =>
    spectator.query<HTMLAnchorElement>("a#print-button")!;
  const pointMaps = (): SiteMapComponent => spectator.query(SiteMapComponent)!;

  function setPrintDialogPreference(showPrintDialog: boolean): void {
    const localStorageKey = "hidePrintModal";

    if (showPrintDialog) {
      window.localStorage.removeItem(localStorageKey);
    } else {
      window.localStorage.setItem(localStorageKey, "true");
    }
  }

  assertPageInfo(ViewAnnotationReportComponent, "Annotation Report");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(ViewAnnotationReportComponent);
  });

  it("should only call the selected chart endpoints", () => {
    expect(eventSummariesFilterSpy).toHaveBeenCalled();
    expect(recordingCoverageFilterSpy).toHaveBeenCalled();
    expect(analysisCoverageFilterSpy).toHaveBeenCalled();
    expect(tagFrequencyFilterSpy).toHaveBeenCalled();
    expect(tagAccumulationFilterSpy).not.toHaveBeenCalled();
  });

  it("should show loading states while report endpoints are pending", () => {
    spectator.fixture.destroy();
    eventSummariesFilterSpy.and.returnValue(NEVER);
    tagFrequencyFilterSpy.and.returnValue(NEVER);
    recordingCoverageFilterSpy.and.returnValue(NEVER);
    analysisCoverageFilterSpy.and.returnValue(NEVER);
    setup(
      generateAnnotationReportUrlParams({
        charts: [
          Chart.coverage,
          Chart.eventSummary,
          Chart.speciesCompositionCurve,
          Chart.speciesTimeSeries,
        ].join(","),
      }),
    );

    const loadingStatuses = spectator
      .queryAll<HTMLElement>("[role='status']")
      .map((element) => element.textContent?.trim());

    expect(
      spectator.queryAll<HTMLElement>("#coverage-container [role='status']"),
    ).toHaveSize(1);
    expect(loadingStatuses).toHaveSize(4);
  });

  it("should persist coverage and event summary visibility in chart parameters", () => {
    const replaceStateSpy = spyOn(
      spectator.component["location"],
      "replaceState",
    ).and.callThrough();

    spectator.component["toggleChart"](Chart.coverage, true);
    spectator.component["toggleChart"](Chart.eventSummary, true);

    expect(defaultParameterDataModel.charts).toEqual([
      Chart.speciesCompositionCurve,
      Chart.coverage,
      Chart.eventSummary,
    ]);
    const sharedUrl = replaceStateSpy.calls.mostRecent().args[0];
    expect(sharedUrl).toContain("coverage");
    expect(sharedUrl).toContain("event-summary");
  });

  it("should not refetch base report endpoints when toggling a chart", () => {
    spectator.component["toggleChart"](Chart.speciesAccumulationCurve, true);

    expect(eventSummariesFilterSpy).toHaveBeenCalledTimes(1);
    expect(recordingCoverageFilterSpy).toHaveBeenCalledTimes(1);
    expect(analysisCoverageFilterSpy).toHaveBeenCalledTimes(1);
    expect(tagFrequencyFilterSpy).toHaveBeenCalledTimes(1);
  });

  it("should call the system print api on print icon click and the user has set the preference not to show the print dialog", () => {
    setPrintDialogPreference(false);
    // we have to monkey patch window.print so that the system print dialog doesn't open as this will stop the tests
    window.print = () => undefined;
    const printSpy = spyOn(window, "print");

    printButtonElement().click();
    expect(printSpy).toHaveBeenCalled();
  });

  it("should show a print dialog box when clicking the print icon and the user has not set their preference on the print dialog", () => {
    setPrintDialogPreference(true);
    window.print = () => undefined;
    const printSpy = spyOn(window, "print");

    printButtonElement().click();

    expect(printSpy).not.toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalled();
  });

  it("should show a print dialog box when the user presses ctrl + P and the user has not set their preference on the print dialog", () => {
    setPrintDialogPreference(true);
    window.print = () => undefined;
    const printSpy = spyOn(window, "print");

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        ctrlKey: true,
        key: "p",
      }),
    );

    expect(printSpy).not.toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalled();
  });

  it("should call system print when the user presses ctrl + p and the user has set the preference not to show the print dialog", () => {
    setPrintDialogPreference(false);
    window.print = () => undefined;
    const printSpy = spyOn(window, "print");

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        ctrlKey: true,
        key: "p",
      }),
    );

    expect(printSpy).toHaveBeenCalled();
    expect(modalService.open).not.toHaveBeenCalled();
  });

  // during the prototyping phase, the point maps are not implemented
  it("should show sensor points on point maps", () => {
    const pointMapElement: SiteMapComponent = pointMaps();
    expect(pointMapElement).toExist();
  });

  // TODO: since false colour spectrograms will be handled by another un-built server route, we need to create tests once functional
  xit("should make the correct api calls for the false colour spectrograms", () => {
    pending();
  });
});
