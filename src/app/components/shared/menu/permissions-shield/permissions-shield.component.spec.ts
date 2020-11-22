import { Injector } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import { MockModel } from '@baw-api/mock/baseApiMock.service';
import { ACCOUNT } from '@baw-api/ServiceTokens';
import { AccessLevel } from '@interfaces/apiInterfaces';
import { UserBadgeComponent } from '@menu/user-badge/user-badge.component';
import { UnresolvedModel } from '@models/AbstractModel';
import { Project } from '@models/Project';
import { Region } from '@models/Region';
import { Site } from '@models/Site';
import { User } from '@models/User';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { generateApiErrorDetails } from '@test/fakes/ApiErrorDetails';
import { generateProject } from '@test/fakes/Project';
import { generateRegion } from '@test/fakes/Region';
import { generateSite } from '@test/fakes/Site';
import { generateUser } from '@test/fakes/User';
import { modelData } from '@test/helpers/faker';
import { nStepObservable } from '@test/helpers/general';
import { MockData, MockResolvers } from '@test/helpers/testbed';
import { MockComponent } from 'ng-mocks';
import { Subject } from 'rxjs';
import { PermissionsShieldComponent } from './permissions-shield.component';

const mockUserBadge = MockComponent(UserBadgeComponent);

describe('PermissionsShieldComponent', () => {
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
    imports: [RouterTestingModule, MockBawApiModule],
  });

  function getUserBadges() {
    return spec.queryAll(mockUserBadge);
  }

  function setup(
    resolvers: MockResolvers,
    data: MockData,
    user?: User
  ): Promise<void> {
    spec = createComponent({
      detectChanges: false,
      data: { resolvers, ...data },
    });
    injector = spec.inject(Injector);
    const api = spec.inject(ACCOUNT.token);

    // Insert injectors into models
    defaultProject['injector'] = injector;
    defaultRegion['injector'] = injector;
    defaultSite['injector'] = injector;
    defaultModel['injector'] = injector;

    const subject = new Subject<User>();
    api.show.andCallFake(() => subject);
    return nStepObservable(subject, () => user ?? defaultUser);
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite());
    defaultModel = new MockModel({});
    defaultUser = new User(generateUser());
  });

  describe('model prioritization', () => {
    it('should retrieve model from resolvers', () => {
      setup({ model: 'resolver' }, { model: { model: defaultModel } });
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultModel);
    });

    it('should prioritize site', () => {
      setup(
        {
          model: 'resolver',
          project: 'resolver',
          site: 'resolver',
          region: 'resolver',
        },
        {
          model: { model: defaultModel },
          project: { model: defaultProject },
          site: { model: defaultSite },
          region: { model: defaultRegion },
        }
      );
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultSite);
    });

    it('should prioritize region if no site', () => {
      setup(
        {
          model: 'resolver',
          region: 'resolver',
          project: 'resolver',
        },
        {
          model: { model: defaultModel },
          region: { model: defaultRegion },
          project: { model: defaultProject },
        }
      );
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultRegion);
    });

    it('should prioritize project if no region or site', () => {
      setup(
        { model: 'resolver', project: 'resolver' },
        {
          model: { model: defaultModel },
          project: { model: defaultProject },
        }
      );
      spec.detectChanges();
      expect(spec.component.model).toEqual(defaultProject);
    });

    it('should handle model error', () => {
      setup(
        {
          model: 'resolver',
          project: 'resolver',
          site: 'resolver',
          region: 'resolver',
        },
        {
          model: { model: defaultModel },
          project: { model: defaultProject },
          site: { error: generateApiErrorDetails() },
          region: { model: defaultRegion },
        }
      );
      spec.detectChanges();
      expect(spec.element.childElementCount).toBe(0);
    });

    it('should not display if no resolvers found', () => {
      setup({}, {});
      spec.detectChanges();
      expect(spec.component.model).toEqual(undefined);
    });

    it('should not display if no single abstract model found', () => {
      setup({ model: 'resolver' }, { model: { model: [defaultModel] } });
      spec.detectChanges();
      expect(spec.component.model).toEqual(undefined);
    });
  });

  describe('access level', () => {
    function assertAccessLevel(accessLevel?: AccessLevel) {
      if (!accessLevel) {
        expect(spec.query('#access-level-label')).toBeFalsy();
        expect(spec.query('#access-level')).toBeFalsy();
      } else {
        expect(spec.query('#access-level-label')).toBeTruthy();
        expect(spec.query('#access-level')).toHaveText(accessLevel);
      }
    }

    it('should display access level', () => {
      const accessLevel = modelData.accessLevel();
      const model = new MockModel({ accessLevel });
      setup({ model: 'resolver' }, { model: { model } });
      spec.detectChanges();
      assertAccessLevel(accessLevel);
    });

    it('should display access level if project model exists', () => {
      setup(
        { project: 'resolver', site: 'resolver' },
        { project: { model: defaultProject }, site: { model: defaultSite } }
      );
      spec.detectChanges();
      assertAccessLevel(defaultProject.accessLevel);
    });

    it('should not display access level if none exists', () => {
      setup({ model: 'resolver' }, { model: { model: defaultModel } });
      spec.detectChanges();
      assertAccessLevel();
    });
  });

  describe('user badges', () => {
    [
      {
        id: 'creatorId',
        label: 'Created By',
        timestampKey: 'createdAt',
      },
      {
        id: 'updaterId',
        label: 'Updated By',
        timestampKey: 'updatedAt',
      },
      {
        id: 'ownerId',
        label: 'Owned By',
      },
    ].forEach(({ id, label, timestampKey }, index) => {
      describe(label, () => {
        function getUserBadge() {
          return getUserBadges()[index];
        }

        it('should not create badge if id is not found', () => {
          defaultProject[id] = undefined;
          setup(
            { project: 'resolver' },
            { project: { model: defaultProject } }
          );
          spec.detectChanges();
          expect(getUserBadge()?.label).not.toBe(label);
        });

        it('should set badge label', () => {
          setup(
            { project: 'resolver' },
            { project: { model: defaultProject } }
          );
          spec.detectChanges();
          expect(getUserBadge().label).toBe(label);
        });

        it('should set badge user', async () => {
          const promise = setup(
            { project: 'resolver' },
            { project: { model: defaultProject } }
          );
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          expect(getUserBadge().user).toEqual(defaultUser);
        });

        it('should set badge unresolved model', async () => {
          setup(
            { project: 'resolver' },
            { project: { model: defaultProject } }
          );
          spec.detectChanges();
          expect(getUserBadge().user).toEqual(UnresolvedModel.one as any);
        });

        it('should resolve badge user', async () => {
          const promise = setup(
            { project: 'resolver' },
            { project: { model: defaultProject } }
          );
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          expect(getUserBadge().user).toEqual(defaultUser);
        });

        it(`should ${timestampKey ? '' : 'not '}set badge timestamp`, () => {
          setup(
            { project: 'resolver' },
            { project: { model: defaultProject } }
          );
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

    it('should set multiple badges', async () => {
      const promise = setup(
        { project: 'resolver' },
        { project: { model: defaultProject } }
      );
      spec.detectChanges();
      await promise;
      spec.detectChanges();
      expect(getUserBadges().length).toBe(3);
    });
  });
});
