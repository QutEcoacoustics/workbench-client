import { ApiErrorDetails } from '@baw-api/api.interceptor.service';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import { projectResolvers } from '@baw-api/project/projects.service';
import { siteResolvers, SitesService } from '@baw-api/site/sites.service';
import { Project } from '@models/Project';
import { Site } from '@models/Site';
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from '@ngneat/spectator';
import { FormComponent } from '@shared/form/form.component';
import { generateApiErrorDetails } from '@test/fakes/ApiErrorDetails';
import { generateProject } from '@test/fakes/Project';
import { generateSite } from '@test/fakes/Site';
import { assertErrorHandler } from '@test/helpers/html';
import { testFormImports } from '@test/helpers/testbed';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { SiteDeleteComponent } from './site.component';

describe('SiteDeleteComponent', () => {
  let api: SpyObject<SitesService>;
  let defaultProject: Project;
  let defaultSite: Site;
  let spectator: SpectatorRouting<SiteDeleteComponent>;
  const createComponent = createRoutingFactory({
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
    component: SiteDeleteComponent,
    stubsEnabled: true,
  });

  function setup(
    project: Project,
    site: Site,
    projectError?: ApiErrorDetails,
    siteError?: ApiErrorDetails
  ) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          project: projectResolvers.show,
          site: siteResolvers.show,
        },
        project: { model: project, error: projectError },
        site: { model: site, error: siteError },
      },
    });

    api = spectator.inject(SitesService);
    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultSite = new Site(generateSite());
  });

  describe('form', () => {
    it('should have no fields', () => {
      setup(defaultProject, defaultSite);
      expect(spectator.component.fields).toEqual([]);
    });
  });

  describe('component', () => {
    it('should create', () => {
      setup(defaultProject, defaultSite);
      expect(spectator.component).toBeTruthy();
    });

    it('should handle project error', () => {
      setup(undefined, defaultSite, generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it('should handle site error', () => {
      setup(defaultProject, undefined, undefined, generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it('should call api', () => {
      setup(defaultProject, defaultSite);
      api.destroy.and.callFake(() => new Subject());
      spectator.component.submit({ ...defaultSite });
      expect(api.destroy).toHaveBeenCalledWith(
        new Site(defaultSite),
        defaultProject
      );
    });

    it('should redirect to projects', () => {
      const spy = spyOnProperty(defaultProject, 'viewUrl');
      setup(defaultProject, defaultSite);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      spectator.component.submit({});
      expect(spy).toHaveBeenCalled();
    });
  });
});
