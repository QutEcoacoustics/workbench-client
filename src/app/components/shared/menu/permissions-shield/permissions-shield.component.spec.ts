import { Injector } from "@angular/core";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MockModel } from "@baw-api/mock/baseApiMock.service";
import { ACCOUNT } from "@baw-api/ServiceTokens";
import { AccessLevel } from "@interfaces/apiInterfaces";
import { UserBadgeComponent } from "@menu/user-badge/user-badge.component";
import { UnresolvedModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { nStepObservable } from "@test/helpers/general";
import { MockData } from "@test/helpers/testbed";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { PermissionsShieldComponent } from "./permissions-shield.component";

const mockUserBadge = MockComponent(UserBadgeComponent);

describe("PermissionsShieldComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let defaultModel: MockModel;
  let defaultUser: User;
  let injector: Injector;
  let spec: SpectatorRouting<PermissionsShieldComponent>;
  const createComponent = createRoutingFactory({
    component: PermissionsShieldComponent,
    declarations: [mockUserBadge],
    imports: [MockBawApiModule],
  });

  function getUserBadges() {
    return spec.queryAll(mockUserBadge);
  }

  function setup(resolvers: string[], data: MockData): Promise<any> {
    const resolverList = {};
    resolvers.forEach((resolver) => (resolverList[resolver] = "resolver"));
    const routeData = { resolvers: resolverList, ...data };
    spec = createComponent({ detectChanges: false, data: routeData });
    injector = spec.inject(Injector);
    const api = spec.inject(ACCOUNT.token);

    // Insert injectors into models
    defaultProject["injector"] = injector;
    defaultRegion["injector"] = injector;
    defaultSite["injector"] = injector;
    defaultModel["injector"] = injector;

    const userSubject = new Subject<User>();
    const usersSubject = new Subject<User[]>();
    api.show.andCallFake(() => userSubject);
    api.filter.andCallFake(() => usersSubject);

    return Promise.all([
      nStepObservable(userSubject, () => defaultUser),
      nStepObservable(usersSubject, () => [defaultUser]),
    ]);
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite());
    defaultModel = new MockModel({});
    defaultUser = new User(generateUser());
  });

  describe("model prioritization", () => {
    it("should retrieve model from resolvers", () => {
      setup(["model"], { model: { model: defaultModel } });
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultModel);
    });

    it("should prioritize site", () => {
      setup(["model", "project", "site", "region"], {
        model: { model: defaultModel },
        project: { model: defaultProject },
        site: { model: defaultSite },
        region: { model: defaultRegion },
      });
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultSite);
    });

    it("should prioritize region if no site", () => {
      setup(["model", "project", "region"], {
        model: { model: defaultModel },
        region: { model: defaultRegion },
        project: { model: defaultProject },
      });
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultRegion);
    });

    it("should prioritize project if no region or site", () => {
      setup(["model", "project"], {
        model: { model: defaultModel },
        project: { model: defaultProject },
      });
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultProject);
    });

    it("should handle model error", () => {
      setup(["model", "project", "site", "region"], {
        model: { model: defaultModel },
        project: { model: defaultProject },
        site: { error: generateApiErrorDetails() },
        region: { model: defaultRegion },
      });
      spec.detectChanges();
      expect(spec.element.childElementCount).toBe(0);
    });

    it("should not display if no resolvers found", () => {
      setup([], {});
      spec.detectChanges();
      expect(spec.component.model).toEqual(undefined);
    });

    it("should not display if no single abstract model found", () => {
      setup(["model"], { model: { model: [defaultModel] } });
      spec.detectChanges();
      expect(spec.component.model).toEqual(undefined);
    });
  });

  describe("access level", () => {
    function assertAccessLevel(accessLevel?: AccessLevel) {
      if (!accessLevel) {
        expect(spec.query("#access-level-label")).toBeFalsy();
        expect(spec.query("#access-level")).toBeFalsy();
      } else {
        expect(spec.query("#access-level-label")).toBeTruthy();
        expect(spec.query("#access-level")).toHaveText(accessLevel);
      }
    }

    it("should display access level", () => {
      const accessLevel = modelData.accessLevel();
      const model = new MockModel({ accessLevel });
      setup(["model"], { model: { model } });
      spec.detectChanges();
      assertAccessLevel(accessLevel);
    });

    it("should display access level if project model exists", () => {
      setup(["project", "site"], {
        project: { model: defaultProject },
        site: { model: defaultSite },
      });
      spec.detectChanges();
      assertAccessLevel(defaultProject.accessLevel);
    });

    it("should not display access level if none exists", () => {
      setup(["model"], { model: { model: defaultModel } });
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
          const promise = setup(["project"], {
            project: { model: defaultProject },
          });
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          expect(getLabel()).toHaveText(label);
        });

        it("should not create badge if id is not found", () => {
          defaultProject[id] = undefined;
          setup(["project"], { project: { model: defaultProject } });
          spec.detectChanges();
          expect(spec.component.badges[index]?.label).not.toBe(label);
        });

        it("should not create label if id is not found", () => {
          defaultProject[id] = undefined;
          setup(["project"], { project: { model: defaultProject } });
          spec.detectChanges();
          expect(getLabel()).not.toHaveText(label);
        });

        it("should set badge user", async () => {
          const promise = setup(["project"], {
            project: { model: defaultProject },
          });
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          assertUsers(defaultUser);
        });

        it("should set badge unresolved model", async () => {
          setup(["project"], { project: { model: defaultProject } });
          spec.detectChanges();
          if (multipleUsers) {
            assertUsers();
          } else {
            assertUsers(UnresolvedModel.one as any);
          }
        });

        it("should resolve badge user", async () => {
          const promise = setup(["project"], {
            project: { model: defaultProject },
          });
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          assertUsers(defaultUser);
        });

        it(`should ${timestampKey ? "" : "not "}set badge timestamp`, () => {
          setup(["project"], { project: { model: defaultProject } });
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
      const promise = setup(["project"], {
        project: { model: defaultProject },
      });
      spec.detectChanges();
      await promise;
      spec.detectChanges();
      expect(getUserBadges().length).toBe(3);
    });
  });
});
