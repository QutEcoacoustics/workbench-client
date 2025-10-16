import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Params } from "@angular/router";
import { EventsPageComponent } from "./events.component";
import { Project } from "@models/Project";
import { EventMapSearchParameters } from "./eventMapSearchParameters";
import { AnnotationSearchParameters } from "@components/annotations/components/annotation-search-form/annotationSearchParameters";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { generateAnnotationSearchUrlParameters } from "@test/fakes/data/AnnotationSearchParameters";
import { IconsModule } from "@shared/icons/icons.module";
import { assertPageInfo } from "@test/helpers/pageRoute";

describe("EventsPageComponent", () => {
  let spec: SpectatorRouting<EventsPageComponent>;

  let project: Project;
  let region: Region;
  let site: Site;

  let eventMapSearchParameters: EventMapSearchParameters;
  let annotationSearchParameters: AnnotationSearchParameters;

  const createComponent = createRoutingFactory({
    component: EventsPageComponent,
    providers: [provideMockBawApi()],
    imports: [IconsModule],
    data: {
      resolvers: {
        project: "resolver",
        region: "resolver",
        site: "resolver",
        eventMapSearchParameters: "resolver",
        annotationSearchParameters: "resolver",
      },
      project,
      region,
      site,
      eventMapSearchParameters,
      annotationSearchParameters,
    },
  });

  function setup(queryParams: Params = {}): void {
    project = new Project(generateProject());
    region = new Region(generateRegion());
    site = new Site(generateSite());

    eventMapSearchParameters = new EventMapSearchParameters(queryParams);
    annotationSearchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParameters(),
    );

    spec = createComponent({ queryParams });
  }

  assertPageInfo(EventsPageComponent, "Annotation Map");

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(EventsPageComponent);
  });

  describe("api calls", () => {
    it("should make the correct api call without query parameters", () => {
      // Note that there are no "verification status" filter conditions because
      // the page component should set
      // annotationSearchParameters.includeVerificationParams to false.
    });

    it("should make the correct api call with query parameters", () => {});
  });

  describe("focusing sites", () => {
    it("should set the 'focused' url parameter when a site is clicked", () => {});

    it("should show audio events from the focused site in the overlay", () => {});

    it("should have the correct 'show more' link in the overlay", () => {});

    it("should have the correct action links", () => {});

    it("should correctly open the annotation preview modal",() => {});
  });

  describe("filtering", () => {
    // This test asserts that the search parameters are correctly parsed and
    // transferred to the annotation search form, but does not assert that the
    // annotation search form inputs are correctly populated because that is
    // already tested within the annotation search form component tests.
    it("should automatically populate the annotation search form from the url parameters", () => {});

    it("should make an api call with the correct parameters when filters are applied", () => {});

    it("should retain the 'focused' parameter after annotation search parameters", () => {});
  });
});
