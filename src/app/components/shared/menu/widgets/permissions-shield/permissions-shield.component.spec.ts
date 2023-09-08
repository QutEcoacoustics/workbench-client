import { Injector } from "@angular/core";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MockModel } from "@baw-api/mock/baseApiMock.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { ACCOUNT, PROJECT } from "@baw-api/ServiceTokens";
import { titleCase } from "@helpers/case-converter/case-converter";
import { PermissionLevel } from "@interfaces/apiInterfaces";
import { UserBadgeComponent } from "@menu/user-badge/user-badge.component";
import { UnresolvedModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import {
  generatePageInfoResolvers,
  nStepObservable,
} from "@test/helpers/general";
import { MockComponent, MockProvider } from "ng-mocks";
import { of, Subject } from "rxjs";
import { Harvest } from "@models/Harvest";
import { generateHarvest } from "@test/fakes/Harvest";
import { PermissionsShieldComponent } from "./permissions-shield.component";

const mockUserBadge = MockComponent(UserBadgeComponent);

describe("PermissionsShieldComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let defaultHarvest: Harvest;
  let defaultModel: MockModel;
  let defaultUser: User;
  let spec: Spectator<PermissionsShieldComponent>;
  const createComponent = createComponentFactory({
    component: PermissionsShieldComponent,
    declarations: [mockUserBadge],
    imports: [MockBawApiModule],
  });

  function getUserBadges() {
    return spec.queryAll(mockUserBadge);
  }

  function setup(models: ResolvedModel[]): Promise<any> {
    const resolveData = generatePageInfoResolvers(...models);
    spec = createComponent({
      detectChanges: false,
      providers: [
        MockProvider(SharedActivatedRouteService, {
          pageInfo: of(resolveData),
        }),
      ],
    });
    const injector = spec.inject(Injector);
    const userApi = spec.inject(ACCOUNT.token);
    const projectApi = spec.inject(PROJECT.token);

    // Set injectors on models
    models.forEach((model) => {
      if (model.model) {
        model.model["injector"] = injector;
      }
    });

    // Insert injectors into models
    defaultProject["injector"] = injector;
    defaultRegion["injector"] = injector;
    defaultSite["injector"] = injector;
    defaultHarvest["injector"] = injector;
    defaultModel["injector"] = injector;

    const userSubject = new Subject<User>();
    const usersSubject = new Subject<User[]>();
    const projectsSubject = new Subject<Project[]>();
    userApi.show.andCallFake(() => userSubject);
    userApi.filter.andCallFake(() => usersSubject);
    projectApi.filter.andCallFake(() => projectsSubject);

    return Promise.all([
      nStepObservable(userSubject, () => defaultUser),
      nStepObservable(usersSubject, () => [defaultUser]),
      nStepObservable(projectsSubject, () => [defaultProject]),
    ]);
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite());
    defaultHarvest = new Harvest(generateHarvest());
    defaultModel = new MockModel({});
    defaultUser = new User(generateUser());
  });

  describe("model prioritization", () => {
    it("should retrieve model from resolvers", () => {
      setup([{ model: defaultModel }]);
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultModel);
    });

    it("should prioritize harvests", () => {
      setup([
        { model: defaultModel },
        { model: defaultProject },
        { model: defaultRegion },
        { model: defaultSite },
        { model: defaultHarvest },
      ]);
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultHarvest);
    });

    it("should prioritize site if there is no harvest", () => {
      setup([
        { model: defaultModel },
        { model: defaultProject },
        { model: defaultSite },
        { model: defaultRegion },
      ]);
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultSite);
    });

    it("should prioritize region if no site", () => {
      setup([
        { model: defaultModel },
        { model: defaultRegion },
        { model: defaultProject },
      ]);
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultRegion);
    });

    it("should prioritize project if no region or site", () => {
      setup([{ model: defaultModel }, { model: defaultProject }]);
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultProject);
    });

    it("should handle model error", () => {
      setup([
        { model: defaultModel },
        { model: defaultProject },
        { error: generateBawApiError() },
        { model: defaultRegion },
      ]);
      spec.detectChanges();
      expect(spec.element.childElementCount).toBe(0);
    });

    it("should not display if no resolvers found", () => {
      setup([]);
      spec.detectChanges();
      expect(spec.component.model).toEqual(undefined);
    });

    it("should not display if no single abstract model found", () => {
      setup([{ model: [defaultModel] }]);
      spec.detectChanges();
      expect(spec.component.model).toEqual(undefined);
    });
  });

  describe("access level", () => {
    function assertAccessLevel(accessLevel?: PermissionLevel) {
      if (!accessLevel) {
        expect(spec.query("#access-level-label")).toBeFalsy();
        expect(spec.query("#access-level")).toBeFalsy();
      } else {
        expect(spec.query("#access-level-label")).toBeTruthy();
        expect(spec.query("#access-level")).toHaveText(titleCase(accessLevel));
      }
    }

    it("should display access level", () => {
      const accessLevel = modelData.permissionLevel();
      const model = new MockModel({ accessLevel });
      setup([{ model }]);
      spec.detectChanges();
      assertAccessLevel(accessLevel);
    });

    it("should display access level if project model exists", () => {
      setup([{ model: defaultProject }, { model: defaultSite }]);
      spec.detectChanges();
      assertAccessLevel(defaultProject.accessLevel);
    });

    it("should display access level of model if known", () => {
      const accessLevel = modelData.permissionLevel();
      setup([{ model: defaultSite }]);
      spyOnProperty(defaultSite, "accessLevel").and.returnValue(accessLevel);
      spec.detectChanges();
      assertAccessLevel(accessLevel);
    });

    it("should not display access level if none exists", () => {
      setup([{ model: defaultModel }]);
      spec.detectChanges();
      assertAccessLevel();
    });
  });

  describe("user badges", () => {
    [
      {
        id: "creatorId",
        label: "Created By",
        timestampKey: "createdAt",
        multipleUsers: false,
      },
      {
        id: "updaterId",
        label: "Updated By",
        timestampKey: "updatedAt",
        multipleUsers: false,
      },
      {
        id: "ownerIds",
        label: "Owned By",
        multipleUsers: true,
      },
    ].forEach(({ id, label, timestampKey, multipleUsers }, index) => {
      describe(label, () => {
        function getUserBadge() {
          return getUserBadges()[index];
        }

        function getLabel(): HTMLHeadingElement {
          return spec.queryAll<HTMLHeadingElement>("h5")[index];
        }

        function assertUsers(...users: User[]) {
          expect(getUserBadge().users).toEqual(
            multipleUsers ? users : users[0]
          );
        }

        it("should create badge label", async () => {
          const promise = setup([{ model: defaultProject }]);
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          expect(getLabel()).toHaveText(label);
        });

        it("should not create badge if id is not found", () => {
          const project = new Project(generateProject({ [id]: undefined }));
          setup([{ model: project }]);
          spec.detectChanges();
          expect(spec.component.badges[index]?.label).not.toBe(label);
        });

        it("should not create label if id is not found", () => {
          const project = new Project(generateProject({ [id]: undefined }));
          setup([{ model: project }]);
          expect(getLabel()).not.toHaveText(label);
        });

        it("should set badge user", async () => {
          const promise = setup([{ model: defaultProject }]);
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          assertUsers(defaultUser);
        });

        it("should set badge unresolved model", async () => {
          setup([{ model: defaultProject }]);
          spec.detectChanges();
          if (multipleUsers) {
            assertUsers();
          } else {
            assertUsers(UnresolvedModel.one as any);
          }
        });

        it("should resolve badge user", async () => {
          const promise = setup([{ model: defaultProject }]);
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          assertUsers(defaultUser);
        });

        it(`should ${timestampKey ? "" : "not "}set badge timestamp`, () => {
          setup([{ model: defaultProject }]);
          spec.detectChanges();

          if (timestampKey) {
            expect(getUserBadge().timestamp).toEqual(
              defaultProject[timestampKey]
            );
          } else {
            expect(getUserBadge().timestamp).toBeFalsy();
          }
        });
      });
    });

    it("should set multiple badges", async () => {
      const promise = setup([{ model: defaultProject }]);
      spec.detectChanges();
      await promise;
      spec.detectChanges();
      expect(getUserBadges().length).toBe(3);
    });
  });
});
