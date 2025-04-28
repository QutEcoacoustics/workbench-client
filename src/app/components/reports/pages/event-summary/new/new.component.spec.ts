import { SpectatorRouting, createRoutingFactory } from "@ngneat/spectator";
import { DateTimeFilterComponent } from "@shared/date-time-filter/date-time-filter.component";
import { ActivatedRoute, Params } from "@angular/router";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { Region } from "@models/Region";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { Site } from "@models/Site";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { DateTime, Duration } from "luxon";
import { Id } from "@interfaces/apiInterfaces";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { of } from "rxjs";
import { IconsModule } from "@shared/icons/icons.module";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import {
  BucketSize,
  Chart,
  EventSummaryReportParameters,
} from "../EventSummaryReportParameters";
import { NewEventReportComponent } from "./new.component";

describe("NewEventReportComponent", () => {
  let spectator: SpectatorRouting<NewEventReportComponent>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;

  const createComponent = createRoutingFactory({
    component: NewEventReportComponent,
    imports: [IconsModule, DateTimeFilterComponent, TypeaheadInputComponent],
    providers: [provideMockBawApi()],
  });

  function setup(): void {
    spectator = createComponent({
      detectChanges: false,
      data: { projectId: { model: defaultProject } },
      params: {
        projectId: defaultProject.id,
        regionId: defaultRegion.id,
        siteId: defaultSite.id,
      },
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              projectId: defaultProject.id,
              regionId: defaultRegion.id,
              siteId: defaultSite.id,
            }),
          },
        },
      ],
    });

    // since resolver models are assigned during ngOnInit, we can replicate this functionality
    // by assigning them manually
    spectator.component.project = defaultProject;
    spectator.component.region = defaultRegion;
    spectator.component.site = defaultSite;

    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(
      generateRegion({ projectId: defaultProject.id })
    );
    defaultSite = new Site(generateSite({ regionId: defaultRegion.id }));

    setup();
  });

  const pageTitle = (): string =>
    spectator.query<HTMLHeadingElement>("h1.text-muted").innerText;
  const regionsInput = (): HTMLElement =>
    spectator.query<HTMLElement>("baw-typeahead-input[label='Site(s)']");
  const sitesInput = (): HTMLElement =>
    spectator.queryAll<HTMLElement>("baw-typeahead-input")[1];

  assertPageInfo(NewEventReportComponent, "New Event Summary Report");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(NewEventReportComponent);
  });

  it("should use the correct query parameters when the form is has user input/default values", () => {
    const defaultBucketSize = BucketSize.month;

    const expectedQueryParams: Params = {
      bucketSize: defaultBucketSize,
    };

    expect(spectator.component.model.toQueryParams()).toEqual(
      expectedQueryParams
    );
  });

  it("should use the correct query parameters when all form fields have a value", () => {
    const provenanceCutOff = 0.5;
    const bucketSize: BucketSize = BucketSize.day;
    const charts: Chart[] = [
      Chart.falseColorSpectrograms,
      Chart.speciesAccumulationCurve,
    ];

    const provenances: Id[] = [1, 2];

    const expectedQueryParams: Params = {
      bucketSize: BucketSize.day,
      date: "2020-01-01,2020-02-01",
      time: "00:00,23:59",
      provenances: "1,2",
      score: "0.5",
      charts: "false-colour,accumulation",
      tags: "1,2",
    };

    // since typeahead callbacks/model emission is tested within its own component
    // and testing inputs would require mocking option callbacks (negating all benefit from testing through inputs)
    // we can just set the callback models directly
    spectator.component.model = new EventSummaryReportParameters();

    spectator.component.model.date = [
      DateTime.fromFormat("2020-01-01", "yyyy-MM-dd"),
      DateTime.fromFormat("2020-02-01", "yyyy-MM-dd"),
    ];
    spectator.component.model.time = [
      Duration.fromObject({ hours: 0, minutes: 0 }),
      Duration.fromObject({ hours: 23, minutes: 59 }),
    ];
    spectator.component.model.provenances = provenances;
    spectator.component.model.score = provenanceCutOff;
    spectator.component.model.charts = charts;
    spectator.component.model.tags = [1, 2];
    spectator.component.model.bucketSize = bucketSize;

    expect(spectator.component.model.toQueryParams()).toEqual(
      expectedQueryParams
    );
  });

  it("should use the correct page header for points", () => {
    spectator.detectChanges();
    const expectedTitle = `Point: ${spectator.component.site.name}`;
    expect(pageTitle()).toEqual(expectedTitle);
  });

  it("should disable the region and site input if the report is being generated at the point level", () => {
    spectator.detectChanges();

    // because we are fetching the typeahead input component, and the html input element is disabled
    // we need to fetch the raw HTML input DOM element so that we can check that it has been disabled by Angular
    const inputElement: HTMLInputElement =
      sitesInput().querySelector("#typeahead-input");

    expect(inputElement).toHaveProperty("disabled");
  });

  it("should have the the region and site inputs enabled if the report is being generated at the project level", () => {
    spectator.component.region = undefined;
    spectator.component.site = undefined;

    spectator.detectChanges();

    expect(regionsInput().querySelector("input")[0]).not.toHaveAttribute(
      "disabled"
    );
    expect(sitesInput().querySelector("input")[0]).not.toHaveAttribute(
      "disabled"
    );
  });

  it("should hide the 'Site' (region) input if the report is being generated is a site with no points", () => {
    spectator.component.site = new Site(generateSite({ regionId: undefined }));
    spectator.component.region = undefined;
    spectator.detectChanges();

    expect(regionsInput()).not.toExist();
  });
});
