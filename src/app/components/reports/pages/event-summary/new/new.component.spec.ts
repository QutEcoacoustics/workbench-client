import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import {
  DateTimeFilterModel,
  DateTimeFilterComponent,
} from "@shared/date-time-filter/date-time-filter.component";
import { Router } from "@angular/router";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { Region } from "@models/Region";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { Site } from "@models/Site";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { discardPeriodicTasks, fakeAsync, flush } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { Tag } from "@models/Tag";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { generateTag } from "@test/fakes/Tag";
import { Duration } from "luxon";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { BucketSize, ChartType } from "../EventSummaryReportParameters";
import { NewEventReportComponent } from "./new.component";

describe("NewEventReportComponent", () => {
  let spectator: SpectatorRouting<NewEventReportComponent>;
  let routerSpy: SpyObject<Router>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;

  const createComponent = createRoutingFactory({
    declarations: [DateTimeFilterComponent, TypeaheadInputComponent],
    imports: [SharedModule, MockBawApiModule],
    component: NewEventReportComponent,
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    routerSpy = spectator.inject(Router);

    defaultProject = new Project(generateProject());
    defaultRegion = new Region(
      generateRegion({ projectId: defaultProject.id })
    );
    defaultSite = new Site(generateSite({ regionId: defaultRegion.id }));

    spectator.component.project = defaultProject;
    spectator.component.region = defaultRegion;
    spectator.component.site = defaultSite;

    spectator.detectChanges();

    // since resolver models are assigned during ngOnInit, we can replicate this functionality
    // by assigning them manually

    spectator.detectChanges();
  }

  beforeEach(() => setup());

  const regionsInput = (): HTMLElement =>
    spectator.query<HTMLElement>("baw-typeahead-input[label='Site(s)']");
  const provenanceCutOffInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("input[name='provenancesCutOffInput']");
  const generateReportButton = (): HTMLButtonElement =>
    spectator.query<HTMLButtonElement>("#generateReportButton");
  const pageTitle = (): string =>
    spectator.query<HTMLHeadingElement>("h1.text-muted").innerText;

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spectator.debugElement.query(
      (el) => el.nativeElement.innerText === text
    ).nativeElement;
  }

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(NewEventReportComponent);
  });

  it("should navigate to the correct route when the form is submitted with no user input/default values", () => {
    const defaultScoreCutOff = "0.8";
    const defaultBucketSize = BucketSize.month;

    const expectedRoute =
      `/projects/${defaultProject.id}` +
      `/regions/${defaultRegion.id}` +
      `/points/${defaultSite.id}/reports/event-summary` +
      `?score=${defaultScoreCutOff}` +
      `&bucketSize=${defaultBucketSize}`;

    generateReportButton().click();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
  });

  it("should navigate to the correct route when the form is submitted when all fields have a value", fakeAsync(() => {
    const dateTime: DateTimeFilterModel = {
      dateStartedAfter: new NgbDate(2020, 1, 1),
      dateFinishedBefore: new NgbDate(2020, 2, 1),
      timeStartedAfter: Duration.fromObject({
        hours: 0,
        minutes: 0,
      }),
      timeFinishedBefore: Duration.fromObject({
        hours: 23,
        minutes: 59,
      }),
      ignoreDaylightSavings: false
    };

    const provenanceCutOff = 0.5;
    const bucketSize: BucketSize = BucketSize.day;
    const charts: ChartType[] = [ ChartType.sensorPointMap, ChartType.speciesAccumulationCurve ];

    const provenances: AudioEventProvenance[] = [
      new AudioEventProvenance(
        generateAudioEventProvenance({
          id: 1,
          name: "BirdNet",
        })
      ),
      new AudioEventProvenance(
        generateAudioEventProvenance({
          id: 2,
          name: "Lance's recognizer",
        })
      ),
    ];

    const tags: Tag[] = [
      new Tag(generateTag({
        id: 1,
        text: "kookaburra",
      })),
      new Tag(generateTag({
        id: 2,
        text: "mallard",
      })),
    ];

    const expectedRoute =
      `/projects/${defaultProject.id}` +
      `/regions/${defaultRegion.id}` +
      `/points/${defaultSite.id}/reports/event-summary` +
      `?score=${provenanceCutOff}` +
      `&bucketSize=${bucketSize}` +
      "&daylightSavings=false" +
      "&provenances=1,2" +
      "&events=1,2" +
      "&charts=Sensor%20Point%20Map,Species%20Accumulation%20Curve" +
      "&timeStartedAfter=00:00" +
      "&timeFinishedBefore=23:59" +
      "&dateStartedAfter=2020-01-01" +
      "&dateFinishedBefore=2020-02-01";

    // since typeahead callbacks/model emission is tested within its own component
    // and testing inputs would require mocking option callbacks (negating all benefit from testing through inputs)
    // we can just set the callback models directly
    spectator.component.model = {
      dateTime: new BehaviorSubject<DateTimeFilterModel>(dateTime),
      regions: new BehaviorSubject<Region[]>([]),
      sites: new BehaviorSubject<Site[]>([]),
      provenances: new BehaviorSubject<AudioEventProvenance[]>(provenances),
      provenanceScoreCutOff: provenanceCutOff,
      charts: new BehaviorSubject<string[]>(charts),
      eventsOfInterest: new BehaviorSubject<Tag[]>(tags),
      bucketSize
    };

    generateReportButton().click();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedRoute);

    flush();
    discardPeriodicTasks();
  }));

  it("should use the correct title", () => {
    const expectedTitle = `Point: ${spectator.component.site.name}`;
    expect(pageTitle()).toEqual(expectedTitle);
  });

  it("should hide the regions input if the report is being generated at the site or point level", () => {
    spectator.detectChanges();
    expect(regionsInput()).not.toExist();
  });

  it("should show the regions input if the report is being generated at the project level", () => {
    spectator.component.region = undefined;
    spectator.component.site = undefined;
    spectator.detectChanges();

    expect(regionsInput()).toExist();
  });

  // testing other inputs is not needed as they are tested in their own components
  // the provenance cutoff however, is only implemented in the new view, and therefore, needs to be tested here
  describe("provenance cut off input", () => {
    it("should allow valid inputs without showing an error", () => {
      const testValue = 0.64313;
      spectator.typeInElement(testValue.toString(), provenanceCutOffInput());
      spectator.detectChanges();
      expect(provenanceCutOffInput().value).toEqual(testValue.toString());
    });

    it("should not be able to have an input above 1 (100%)", () => {
      const testValue = 1.01;
      const expectedError =
        "The recogniser score cut-off are outside the permitted boundary. Ensure that the value is between 0 and 1.";

      spectator.typeInElement(testValue.toString(), provenanceCutOffInput());
      spectator.detectChanges();

      const errorMessageElement: HTMLLabelElement =
        getElementByInnerText<HTMLLabelElement>(expectedError);
      expect(errorMessageElement).toExist();
      expect(errorMessageElement).toHaveClass("text-danger");
    });

    it("should not be able to have an input below 0 (0%)", () => {
      const testValue = -0.01;
      const expectedError =
        "The recogniser score cut-off are outside the permitted boundary. Ensure that the value is between 0 and 1.";

      spectator.typeInElement(testValue.toString(), provenanceCutOffInput());
      spectator.detectChanges();

      const errorMessageElement: HTMLLabelElement =
        getElementByInnerText<HTMLLabelElement>(expectedError);
      expect(errorMessageElement).toExist();
      expect(errorMessageElement).toHaveClass("text-danger");
    });
  });
});
