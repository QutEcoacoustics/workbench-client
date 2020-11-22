import { ApiErrorDetails } from '@baw-api/api.interceptor.service';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import { projectResolvers } from '@baw-api/project/projects.service';
import { regionResolvers } from '@baw-api/region/regions.service';
import { siteResolvers, SitesService } from '@baw-api/site/sites.service';
import { Project } from '@models/Project';
import { Region } from '@models/Region';
import { Site } from '@models/Site';
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from '@ngneat/spectator';
import { FormComponent } from '@shared/form/form.component';
import { generateApiErrorDetails } from '@test/fakes/ApiErrorDetails';
import { generateProject } from '@test/fakes/Project';
import { generateRegion } from '@test/fakes/Region';
import { generateSite } from '@test/fakes/Site';
import { assertErrorHandler } from '@test/helpers/html';
import { testFormImports } from '@test/helpers/testbed';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { PointDeleteComponent } from './point.component';

describe('PointDeleteComponent', () => {
  let api: SpyObject<SitesService>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let spectator: SpectatorRouting<PointDeleteComponent>;
  const createComponent = createRoutingFactory({
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
    component: PointDeleteComponent,
    stubsEnabled: true,
  });

  function setup(
    project: Project,
    region: Region,
    site: Site,
    projectError?: ApiErrorDetails,
    regionError?: ApiErrorDetails,
    siteError?: ApiErrorDetails
  ) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          project: projectResolvers.show,
          region: regionResolvers.show,
          site: siteResolvers.show,
        },
        project: { model: project, error: projectError },
        region: { model: region, error: regionError },
        site: { model: site, error: siteError },
      },
    });

    api = spectator.inject(SitesService);
    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite(undefined, true));
  });

  describe('form', () => {
    it('should have no fields', () => {
      setup(defaultProject, defaultRegion, defaultSite);
      expect(spectator.component.fields).toEqual([]);
    });
  });

  describe('component', () => {
    it('should create', () => {
      setup(defaultProject, defaultRegion, defaultSite);
      expect(spectator.component).toBeTruthy();
    });

    it('should handle project error', () => {
      setup(undefined, defaultRegion, defaultSite, generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it('should handle region error', () => {
      setup(
        defaultProject,
        undefined,
        defaultSite,
        undefined,
        undefined,
        generateApiErrorDetails()
      );
      assertErrorHandler(spectator.fixture);
    });

    it('should handle site error', () => {
      setup(
        defaultProject,
        defaultRegion,
        undefined,
        undefined,
        undefined,
        generateApiErrorDetails()
      );
      assertErrorHandler(spectator.fixture);
    });

    it('should call api', () => {
      setup(defaultProject, defaultRegion, defaultSite);
      api.destroy.and.callFake(() => new Subject());
      spectator.component.submit({ ...defaultSite });
      expect(api.destroy).toHaveBeenCalledWith(
        new Site(defaultSite),
        defaultProject
      );
    });

    it('should redirect to projects', () => {
      const spy = spyOnProperty(defaultRegion, 'viewUrl');
      setup(defaultProject, defaultRegion, defaultSite);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      spectator.component.submit({});
      expect(spy).toHaveBeenCalled();
    });
  });
});
