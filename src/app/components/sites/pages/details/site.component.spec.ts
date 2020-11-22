import { ApiErrorDetails } from '@baw-api/api.interceptor.service';
import { projectResolvers } from '@baw-api/project/projects.service';
import { siteResolvers } from '@baw-api/site/sites.service';
import { SiteComponent } from '@components/sites/site/site.component';
import { Project } from '@models/Project';
import { Site } from '@models/Site';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { generateApiErrorDetails } from '@test/fakes/ApiErrorDetails';
import { generateProject } from '@test/fakes/Project';
import { generateSite } from '@test/fakes/Site';
import { assertErrorHandler } from '@test/helpers/html';
import { MockComponent } from 'ng-mocks';
import { SiteDetailsComponent } from './site.component';

const mockSiteComponent = MockComponent(SiteComponent);

describe('SiteDetailsComponent', () => {
  let defaultProject: Project;
  let defaultSite: Site;
  let spectator: SpectatorRouting<SiteDetailsComponent>;
  const createComponent = createRoutingFactory({
    declarations: [mockSiteComponent],
    component: SiteDetailsComponent,
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
        resolvers: { project: projectResolvers.show, site: siteResolvers.show },
        project: { model: project, error: projectError },
        site: { model: site, error: siteError },
      },
    });
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultSite = new Site(generateSite());
  });

  it('should create', () => {
    setup(defaultProject, defaultSite);
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should handle failure to retrieve project', () => {
    setup(undefined, defaultSite, generateApiErrorDetails());
    spectator.detectChanges();
    assertErrorHandler(spectator.fixture);
  });

  it('should handle failure to retrieve site', () => {
    setup(defaultProject, undefined, undefined, generateApiErrorDetails());
    spectator.detectChanges();
    assertErrorHandler(spectator.fixture);
  });

  it('should create site details component', () => {
    setup(defaultProject, defaultSite);
    spectator.detectChanges();
    const siteDetails = spectator.query(mockSiteComponent);
    expect(siteDetails).toBeTruthy();
    expect(siteDetails.project).toEqual(defaultProject);
    expect(siteDetails.region).toBeFalsy();
    expect(siteDetails.site).toEqual(defaultSite);
  });
});
