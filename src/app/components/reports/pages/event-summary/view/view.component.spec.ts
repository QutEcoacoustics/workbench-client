import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { toBase64Url } from "@helpers/encoding/encoding";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";
import { MockComponent, MockedComponent } from "ng-mocks";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { AudioEventSummaryReport } from "@models/AudioEventSummaryReport";
import { AUDIO_EVENT_PROVENANCE, AUDIO_EVENT_SUMMARY } from "@baw-api/ServiceTokens";
import { ViewEventReportComponent } from "./view.component";

describe("ViewEventReportComponent", () => {
  let spectator: SpectatorRouting<ViewEventReportComponent>;
  let mockAudioEventProvenanceService: SpyObject<any>; // TODO: BEFORE REVIEW MAKE THIS TYPE SAFE
  let mockEventSummaryService: SpyObject<any>;

  // we need to mock components that call external apis such as the google maps embedded component
  const mockSiteMap = MockComponent(SiteMapComponent);

  const createComponent = createRoutingFactory({
    declarations: [mockSiteMap],
    imports: [MockBawApiModule, SharedModule],
    component: ViewEventReportComponent,
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    spectator.detectChanges();

    // mock services
    mockAudioEventProvenanceService = spectator.inject(AUDIO_EVENT_PROVENANCE.token);
    mockEventSummaryService = spectator.inject(AUDIO_EVENT_SUMMARY.token);

    mockAudioEventProvenanceService.api.show.and.callFake(
      () => new AudioEventProvenance(generateAudioEventProvenance())
    );

    mockEventSummaryService.api.show.and.callFake(
      () => new AudioEventSummaryReport()
    );
  }

  beforeEach(() => setup());

  // there are two locations in the view where the raw events can be download from in the report
  const downloadableEventsLinks = (): HTMLAnchorElement[] =>
    spectator.queryAll("a[name='downloadEventsLink']");
  // there are two locations in the view where the point map is shown in the report, therefore, we need to return an array
  const pointMaps = (): MockedComponent<SiteMapComponent>[] =>
    spectator.queryAll(mockSiteMap);

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(ViewEventReportComponent);
  });

  it("should call the system print dialog api when the print icon is clicked", () => {
    const printSpy = spyOn(window, "print");
    spectator.click("#printButton");
    expect(printSpy).toHaveBeenCalled();
  });

  // the event download link uses a base64 encoding of the filters used to create the report
  // the base64 encoding is used as a GET request is needed for the download link
  it("should create the correct events download link", () => {
    const reportFilters = spectator.component.reportFilters;
    const mockEndpointRoute = "";
    const base64EncodedFilters = toBase64Url(JSON.stringify(reportFilters));

    const expectedRoute = `/${mockEndpointRoute}?filters=${base64EncodedFilters}`;

    const downloadLinks = downloadableEventsLinks();
    downloadLinks.forEach((link: HTMLAnchorElement) =>
      expect(link.href).toContain(expectedRoute)
    );
  });

  describe("charts", () => {
    it("should show sensor points on point maps", () => {
      const pointMapElements = pointMaps();
      pointMapElements.forEach(
        (mapElement: MockedComponent<SiteMapComponent>): void => {
          expect(mapElement).toExist();
        }
      );
    });

    // while the google maps embedding should be hidden if there are no points to show
    // a placeholder maps container should still be shown
    it("should hide the google maps embedding if there are no points to show", () => {});
  });

  describe("tables", () => {
    it("should make the correct api calls when the page is first loaded", () => {});

    it("should create the correct table for a complex api request and response", () => {});
  });
});
