import { SpectatorRouting, createRoutingFactory } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-bawApiMock";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";
import { MockComponent } from "ng-mocks";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { generateEventSummaryReport } from "@test/fakes/EventSummaryReport";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { Region } from "@models/Region";
import { generateRegion } from "@test/fakes/Region";
import { generateEventSummaryReportUrlParameters } from "@test/fakes/data/EventSummaryReportParameters";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { assertPageInfo } from "@test/helpers/pageRoute";
import {
  EventSummaryReportParameters,
} from "../EventSummaryReportParameters";
import { ViewEventReportComponent } from "./view.component";

describe("ViewEventReportComponent", () => {
  let spectator: SpectatorRouting<ViewEventReportComponent>;
  let modalService: NgbModal;
  let modalConfigService: NgbModalConfig;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultReport: EventSummaryReport;
  let defaultParameterDataModel: EventSummaryReportParameters;
  const mockSiteMap = MockComponent(SiteMapComponent);

  const createComponent = createRoutingFactory({
    component: ViewEventReportComponent,
    declarations: [mockSiteMap],
    providers: [provideMockBawApi()],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    // inject the NgbModal service so that we can
    // dismiss all modals at the end of every test
    modalService = spectator.inject(NgbModal);
    modalService.open = jasmine.createSpy("open");

    // inject the bootstrap modal config service so that we can disable animations
    // this is needed so that buttons can be clicked without waiting for the async animation
    modalConfigService = spectator.inject(NgbModalConfig);
    modalConfigService.animation = false;

    spectator.component.project = defaultProject;
    spectator.component.region = defaultRegion;
    spectator.component.report = defaultReport;
    spectator.component.parameterDataModel = defaultParameterDataModel;
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultReport = new EventSummaryReport(
      generateEventSummaryReport()
    );
    defaultParameterDataModel = new EventSummaryReportParameters(
      generateEventSummaryReportUrlParameters()
    );

    setup();
  });

  afterEach(() => {
    modalService.dismissAll();
    window.localStorage.clear();
  });

  const printButtonElement = (): HTMLAnchorElement =>
    spectator.query<HTMLAnchorElement>("a#print-button");
  // there are two locations in the view where the raw events can be download from in the report
  const pointMaps = (): SiteMapComponent =>
    spectator.query(SiteMapComponent);

  function setPrintDialogPreference(showPrintDialog: boolean): void {
    const localStorageKey = "hidePrintModal";

    if (showPrintDialog) {
      window.localStorage.removeItem(localStorageKey);
    } else {
      window.localStorage.setItem(localStorageKey, "true");
    }
  }

  assertPageInfo(ViewEventReportComponent, "Event Summary Report");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(ViewEventReportComponent);
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
      })
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
      })
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
  xit("should make the correct api calls for the false colour spectrograms", () => {});
});
