import { ApiErrorDetails } from '@baw-api/api.interceptor.service';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import { projectResolvers } from '@baw-api/project/projects.service';
import {
  regionResolvers,
  RegionsService,
} from '@baw-api/region/regions.service';
import { Project } from '@models/Project';
import { Region } from '@models/Region';
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from '@ngneat/spectator';
import { FormComponent } from '@shared/form/form.component';
import { generateApiErrorDetails } from '@test/fakes/ApiErrorDetails';
import { generateProject } from '@test/fakes/Project';
import { generateRegion } from '@test/fakes/Region';
import { assertErrorHandler } from '@test/helpers/html';
import { testFormImports } from '@test/helpers/testbed';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeleteComponent } from './delete.component';

describe('RegionsDeleteComponent', () => {
  let api: SpyObject<RegionsService>;
  let defaultRegion: Region;
  let defaultProject: Project;
  let spectator: SpectatorRouting<DeleteComponent>;
  const createComponent = createRoutingFactory({
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
    component: DeleteComponent,
    stubsEnabled: true,
  });

  function setup(
    project: Project,
    region: Region,
    projectError?: ApiErrorDetails,
    regionError?: ApiErrorDetails
  ) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          project: projectResolvers.show,
          region: regionResolvers.show,
        },
        project: { model: project, error: projectError },
        region: { model: region, error: regionError },
      },
    });

    api = spectator.inject(RegionsService);
    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
  });

  describe('form', () => {
    it('should have no fields', () => {
      setup(defaultProject, defaultRegion);
      expect(spectator.component.fields).toEqual([]);
    });
  });

  describe('component', () => {
    it('should create', () => {
      setup(defaultProject, defaultRegion);
      expect(spectator.component).toBeTruthy();
    });

    it('should handle project error', () => {
      setup(undefined, defaultRegion, generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it('should handle region error', () => {
      setup(defaultProject, undefined, undefined, generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it('should call api', () => {
      setup(defaultProject, defaultRegion);
      api.destroy.and.callFake(() => new Subject());
      spectator.component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it('should redirect to projects', () => {
      const spy = spyOnProperty(defaultProject, 'viewUrl');
      setup(defaultProject, defaultRegion);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      spectator.component.submit({});
      expect(spy).toHaveBeenCalled();
    });
  });
});
