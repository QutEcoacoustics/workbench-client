import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { MockData, MockResolvers } from "@test/helpers/testbed";
import { MockComponent } from "ng-mocks";
import { UserBadgesComponent } from "../user-badges/user-badges.component";
import { PermissionsShieldComponent } from "./permissions-shield.component";

describe("PermissionsShieldComponent", () => {
  let spectator: SpectatorRouting<PermissionsShieldComponent>;
  const createComponent = createRoutingFactory({
    component: PermissionsShieldComponent,
    declarations: [MockComponent(UserBadgesComponent)],
    imports: [HttpClientTestingModule, MockBawApiModule],
    stubsEnabled: true,
  });

  function resolvedModel(model: AbstractModel, error?: ApiErrorDetails) {
    return model || error ? { model, error } : undefined;
  }

  function setup(resolvers: MockResolvers, data: MockData) {
    spectator = createComponent({ data: { resolvers, ...data } });
  }

  it("should handle project model", async () => {
    const project = new Project(generateProject());
    setup(
      { project: projectResolvers.show },
      { project: resolvedModel(project) }
    );

    const badges = spectator.query(UserBadgesComponent);
    expect(badges.model).toEqual(project);
  });

  it("should handle site model", async () => {
    const site = new Site(generateSite());
    setup({ site: siteResolvers.show }, { site: resolvedModel(site) });

    const badges = spectator.query(UserBadgesComponent);
    expect(badges.model).toEqual(site);
  });

  // TODO
  xit("should handle project error", () => {});
  xit("should handle site error", () => {});
  xit("should display your access level when owner", () => {});
  xit("should display your access level when writer", () => {});
  xit("should display your access level when reader", () => {});
});
