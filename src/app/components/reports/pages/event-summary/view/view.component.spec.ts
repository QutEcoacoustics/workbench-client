import { SpectatorRouting, createRoutingFactory } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";
import { MockComponent, MockedComponent } from "ng-mocks";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import {
  AUDIO_EVENT_PROVENANCE,
  AUDIO_EVENT_SUMMARY,
} from "@baw-api/ServiceTokens";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { generateEventSummaryReport } from "@test/fakes/EventSummaryReport";
import { ViewEventReportComponent } from "./view.component";

describe("ViewEventReportComponent", () => {
  let spectator: SpectatorRouting<ViewEventReportComponent>;

  // we need to mock components that call external apis such as the google maps embedded component
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
        provide: AUDIO_EVENT_SUMMARY.token,
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
    const base64EncodedFilters = "";
    const expectedRoute = `/?filters=${base64EncodedFilters}`;

    const downloadLinks = downloadableEventsLinks();
    downloadLinks.forEach((link: HTMLAnchorElement) =>
      expect(link.href).toContain(expectedRoute)
    );
  });

  it("should show sensor points on point maps", () => {
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
