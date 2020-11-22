import { ApiErrorDetails } from '@baw-api/api.interceptor.service';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import {
  projectResolvers,
  ProjectsService,
} from '@baw-api/project/projects.service';
import { projectsMenuItem } from '@components/projects/projects.menus';
import { Project } from '@models/Project';
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from '@ngneat/spectator';
import { FormComponent } from '@shared/form/form.component';
import { generateApiErrorDetails } from '@test/fakes/ApiErrorDetails';
import { generateProject } from '@test/fakes/Project';
import { assertErrorHandler } from '@test/helpers/html';
import { testFormImports } from '@test/helpers/testbed';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeleteComponent } from './delete.component';

describe('ProjectsDeleteComponent', () => {
  let api: SpyObject<ProjectsService>;
  let defaultProject: Project;
  let spectator: SpectatorRouting<DeleteComponent>;
  const createComponent = createRoutingFactory({
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
    component: DeleteComponent,
    stubsEnabled: true,
  });

  function setup(model: Project, error?: ApiErrorDetails) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: { project: projectResolvers.show },
        project: { model, error },
      },
    });

    api = spectator.inject(ProjectsService);
    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
  });

  describe('form', () => {
    it('should have no fields', () => {
      setup(defaultProject);
      expect(spectator.component.fields).toEqual([]);
    });
  });

  describe('component', () => {
    it('should create', () => {
      setup(defaultProject);
      expect(spectator.component).toBeTruthy();
    });

    it('should handle project error', () => {
      setup(undefined, generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it('should call api', () => {
      setup(defaultProject);
      api.destroy.and.callFake(() => new Subject());
      spectator.component.submit({ ...defaultProject });
      expect(api.destroy).toHaveBeenCalledWith(new Project(defaultProject));
    });

    it('should redirect to projects', () => {
      setup(defaultProject);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      spectator.component.submit({});
      expect(spectator.router.navigateByUrl).toHaveBeenCalledWith(
        projectsMenuItem.route.toString()
      );
    });
  });
});
