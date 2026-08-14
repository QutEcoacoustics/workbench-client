import { ActivatedRoute, Params } from "@angular/router";
import { Region } from "@models/Region";
import { generateSite } from "@test/fakes/Site";
import { Site } from "@models/Site";
import { Project } from "@models/Project";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import {
  ActivatedRouteStub,
  SpectatorRouting,
  createRoutingFactory,
  mockProvider,
} from "@ngneat/spectator";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { of } from "rxjs";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import {
  AnnotationReportParameters,
  BucketSize,
  Chart,
} from "../AnnotationReportParameters";
import { NewAnnotationReportComponent } from "./new.component";

describe("NewAnnotationReportComponent", () => {
  let spectator: SpectatorRouting<NewAnnotationReportComponent>;
  let iconLibrary: FaIconLibrary;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;

  const createComponent = createRoutingFactory({
    component: NewAnnotationReportComponent,
    providers: [
      provideMockBawApi(),
      mockProvider(SharedActivatedRouteService, {
        activatedRoute: of(
          new ActivatedRouteStub({
            params: { projectId: 1, regionId: 2, siteId: 3 },
            queryParams: {},
            data: {},
          }),
        ),
      }),
    ],
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

    iconLibrary = spectator.inject(FaIconLibrary);
    iconLibrary.addIcons(faCalendar);

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
    spectator.query<HTMLHeadingElement>("h1.text-muted")!.innerText;

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(NewAnnotationReportComponent);
  });

  it("should render grouped chart headings", () => {
    const groupHeadings = spectator
      .queryAll<HTMLElement>("fieldset .text-muted")
      .map((element) => element.textContent?.trim());

    expect(groupHeadings).toEqual([
      "Summaries",
      "Tags overlaid",
      "Tags broken down",
    ]);
  });

  it("should serialize the selected charts into query parameters", () => {
    spectator.component.model = new AnnotationReportParameters();
    spectator.component.model.bucketSize = BucketSize.week;
    spectator.component.model.charts = [
      Chart.tagFrequencyStacked,
      Chart.tagBreakdown,
    ];

    const queryParams: Params = spectator.component.model.toQueryParams();

    expect(queryParams["bucketSize"]).toBe(BucketSize.week);
    expect(queryParams["charts"]).toBe(
      [Chart.tagFrequencyStacked, Chart.tagBreakdown].join(","),
    );
  });

  it("should use the correct page header for points", () => {
    spectator.detectChanges();
    const expectedTitle = `Point: ${spectator.component.site!.name}`;
    expect(pageTitle()).toEqual(expectedTitle);
  });
});
