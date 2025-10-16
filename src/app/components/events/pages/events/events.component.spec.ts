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
});
