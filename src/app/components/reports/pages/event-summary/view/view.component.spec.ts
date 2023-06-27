import { SpectatorRouting, createRoutingFactory } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";
import { MockComponent, MockedComponent } from "ng-mocks";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import {
  AUDIO_EVENT_PROVENANCE,
  AUDIO_EVENT_SUMMARY_REPORT,
} from "@baw-api/ServiceTokens";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { generateEventSummaryReport } from "@test/fakes/EventSummaryReport";
import { ViewEventReportComponent } from "./view.component";

describe("ViewEventReportComponent", () => {
  let spectator: SpectatorRouting<ViewEventReportComponent>;
  const mockSiteMap = MockComponent(SiteMapComponent);

  // there are two locations in the view where the raw events can be download from in the report
  const downloadableEventsLinks = (): HTMLAnchorElement[] =>
    spectator.queryAll("a[name='downloadEventsLink']");
  // there are two locations in the view where the point map is shown in the report, therefore, we need to return an array
  const pointMaps = (): MockedComponent<SiteMapComponent>[] =>
    spectator.queryAll(mockSiteMap);

  const createComponent = createRoutingFactory({
    declarations: [mockSiteMap],
    imports: [MockBawApiModule, SharedModule],
    component: ViewEventReportComponent,
    providers: [
      {
        provide: AUDIO_EVENT_SUMMARY_REPORT.token,
        useValue: {
          filterShow: () =>
            new EventSummaryReport(generateEventSummaryReport()),
        },
      },
      {
        provide: AUDIO_EVENT_PROVENANCE.token,
        useValue: {
          show: () => new AudioEventProvenance(generateAudioEventProvenance()),
        },
      },
    ],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    // these models are usually assigned during the route resolver
    // to mock this behavior, we can
    spectator.component.report = new EventSummaryReport(
      generateEventSummaryReport()
    );
    spectator.detectChanges();
  }

  beforeEach(() => setup());

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
    const expectedBase64EncodedFilters = "";
    const routeBase = "https://api.staging.ecosounds.org/projects/1135/audio_events/download.csv";
    const filterParameters = `/?filters=${expectedBase64EncodedFilters}`;

    const downloadLinks = downloadableEventsLinks();
    downloadLinks.forEach((link: HTMLAnchorElement) =>
      expect(link.href).toEqual(routeBase + filterParameters)
    );
  });

  // during the prototyping phase, the point maps are not implemented
  // TODO: enable this test once the api is fully functional
  xit("should show sensor points on point maps", () => {
    const pointMapElements: MockedComponent<SiteMapComponent>[] = pointMaps();
    expect(pointMapElements).not.toHaveLength(0);

    pointMapElements.forEach(
      (mapElement: MockedComponent<SiteMapComponent>): void => {
        expect(mapElement).toExist();
      }
    );
  });

  // TODO: since false colour spectrograms will be handled by another un-built server route, we need to create tests once functional
  xit("should make the correct api calls for the false colour spectrograms", () => {});
});
