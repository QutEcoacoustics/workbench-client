import { RouterTestingModule } from '@angular/router/testing';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import { SharedModule } from '@components/shared/shared.module';
import { Project } from '@models/Project';
import { Region } from '@models/Region';
import { Site } from '@models/Site';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { assetRoot } from '@services/app-config/app-config.service';
import { MapComponent } from '@shared/map/map.component';
import { generateProject } from '@test/fakes/Project';
import { generateRegion } from '@test/fakes/Region';
import { generateSite } from '@test/fakes/Site';
import { assertImage } from '@test/helpers/html';
import { websiteHttpUrl } from '@test/helpers/url';
import { MockComponent } from 'ng-mocks';
import { SiteComponent } from './site.component';

const mockMapComponent = MockComponent(MapComponent);

describe('SiteComponent', () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let spectator: Spectator<SiteComponent>;
  const createComponent = createComponentFactory({
    imports: [SharedModule, MockBawApiModule, RouterTestingModule],
    declarations: [mockMapComponent],
    component: SiteComponent,
  });

  function setup(project: Project, site: Site, region?: Region) {
    spectator = createComponent({
      detectChanges: false,
      props: { project, site, region },
    });
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite());
  });

  it('should create', () => {
    setup(defaultProject, defaultSite);
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  describe('Project', () => {
    it('should display project name', () => {
      setup(defaultProject, defaultSite);
      spectator.detectChanges();

      const title = spectator.query<HTMLHeadingElement>('h2');
      expect(title).toBeTruthy();
      expect(title.innerText).toContain(`Project: ${defaultProject.name}`);
    });
  });

  describe('Region', () => {
    it('should not display region name if doesn\'t exist', () => {
      setup(defaultProject, defaultSite, undefined);
      spectator.detectChanges();

      const title = spectator.query<HTMLHeadingElement>('h3');
      expect(title).toBeFalsy();
    });

    it('should display region name if exists', () => {
      setup(defaultProject, defaultSite, defaultRegion);
      spectator.detectChanges();

      const title = spectator.query<HTMLHeadingElement>('h3');
      expect(title).toBeTruthy();
      expect(title.innerText).toContain(`Site: ${defaultRegion.name}`);
    });
  });

  describe('Site', () => {
    it('should display site name', () => {
      setup(defaultProject, defaultSite);
      spectator.detectChanges();

      const title = spectator.query<HTMLHeadingElement>('h1');
      expect(title).toBeTruthy();
      expect(title.innerText).toContain(defaultSite.name);
    });

    it('should display default site image', () => {
      const site = new Site({ ...generateSite(), imageUrl: undefined });
      setup(defaultProject, site);
      spectator.detectChanges();

      const image = spectator.query<HTMLImageElement>('img');
      assertImage(
        image,
        `${websiteHttpUrl}${assetRoot}/images/site/site_span4.png`,
        `${site.name} image`
      );
    });

    it('should display custom site image', () => {
      setup(defaultProject, defaultSite);
      spectator.detectChanges();

      const image = spectator.query<HTMLImageElement>('img');
      assertImage(image, defaultSite.imageUrl, `${defaultSite.name} image`);
    });

    it('should display default description if model has none', () => {
      const site = new Site({ ...generateSite(), descriptionHtml: undefined });
      setup(defaultProject, site);
      spectator.detectChanges();

      const description = spectator.query('#site_description');
      expect(description).toBeTruthy();
      expect(description.innerHTML).toContain('<i>No description found</i>');
    });

    it('should display site description with html markup', () => {
      setup(defaultProject, defaultSite);
      spectator.detectChanges();

      const description = spectator.query('#site_description');
      expect(description).toBeTruthy();
      expect(description.innerHTML).toContain(defaultSite.descriptionHtml);
    });
  });

  describe('Google Maps', () => {
    it('should create google maps component', () => {
      setup(defaultProject, defaultSite);
      spectator.detectChanges();
      expect(spectator.query(mockMapComponent)).toBeTruthy();
    });

    it('should create site marker', () => {
      setup(defaultProject, defaultSite);
      spectator.detectChanges();
      const maps = spectator.query(mockMapComponent);
      expect(maps.markers.toArray()).toEqual([defaultSite.getMapMarker()]);
    });
  });

  // TODO Implement tests for audio recordings
});
