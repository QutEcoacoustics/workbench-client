import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { BawSessionService } from "@baw-api/baw-session.service";
import { DirectivesModule } from "@directives/directives.module";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import {
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
} from "@ngneat/spectator";
import { generatePageInfo } from "@test/fakes/PageInfo";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { generateUser } from "@test/fakes/User";
import { SiteHarvestComponent } from "./harvest.component";

describe("SiteHarvestComponent", () => {
  let project: Project;
  let region: Region;
  let site: Site;
  let user: User;
  let spec: SpectatorRouting<SiteHarvestComponent>;
  const createComponent = createRoutingFactory({
    component: SiteHarvestComponent,
    imports: [RouterTestingModule, DirectivesModule, MockBawApiModule],
  });

  function getHarvestTemplate() {
    return spec.query("pre");
  }

  function setup() {
    spec = createComponent({
      data: generatePageInfo({
        resolvers: {
          project: "resolver",
          region: "resolver",
          site: "resolver",
        },
        project: { model: project },
        region: { model: region },
        site: { model: site },
      }),
      providers: [mockProvider(BawSessionService, { loggedInUser: user })],
    });
  }

  beforeEach(() => {
    project = new Project(generateProject());
    region = new Region(generateRegion());
    site = new Site(generateSite());
    user = new User(generateUser());
  });

  it("should include project id in harvest template", () => {
    setup();
    expect(getHarvestTemplate()).toContainText(`project_id: ${project.id}`);
  });

  it("should include site id in harvest template", () => {
    setup();
    expect(getHarvestTemplate()).toContainText(`site_id: ${site.id}`);
  });

  it("should include user id in harvest template", () => {
    setup();
    expect(getHarvestTemplate()).toContainText(
      `uploader_id: ${user.id} # ${user.userName}`
    );
  });
});
