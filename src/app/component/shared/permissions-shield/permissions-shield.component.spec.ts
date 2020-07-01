import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { AbstractModel } from "@models/AbstractModel";
import { User } from "@models/User";
import {
  createComponentFactory,
  createRoutingFactory,
  Spectator,
  SpectatorRouting,
} from "@ngneat/spectator";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { nStepObservable } from "@test/helpers/general";
import { promises } from "fs";
import { Subject } from "rxjs";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import {
  mockActivatedRoute,
  MockData,
  MockResolvers,
  testBawServices,
} from "src/app/test/helpers/testbed";
import { UserBadgeComponent } from "../user-badges/user-badge/user-badge.component";
import { UserBadgesComponent } from "../user-badges/user-badges.component";
import { PermissionsShieldComponent } from "./permissions-shield.component";

describe("PermissionsShieldComponent", () => {
  let spectator: SpectatorRouting<PermissionsShieldComponent>;
  let api: AccountsService;
  const createComponent = createRoutingFactory({
    component: PermissionsShieldComponent,
    declarations: [UserBadgesComponent, UserBadgeComponent],
    imports: [HttpClientTestingModule],
    providers: testBawServices,
    stubsEnabled: true,
  });

  function resolvedModel(model: AbstractModel, error?: ApiErrorDetails) {
    return model || error ? { model, error } : undefined;
  }

  function setup(resolvers: MockResolvers, data: MockData) {
    // TODO Simplify this by mocking UserBadgesComponent
    spectator = createComponent({ data: { resolvers, ...data } });
    api = spectator.inject(AccountsService);
    spyOn(api, "show").and.stub();
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
