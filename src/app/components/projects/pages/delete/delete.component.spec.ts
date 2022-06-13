import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { Project } from "@models/Project";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { DeleteComponent } from "./delete.component";

describe("ProjectsDeleteComponent", () => {
  let api: SpyObject<ProjectsService>;
  let defaultModel: Project;
  let spec: SpectatorRouting<DeleteComponent>;
  const createComponent = createRoutingFactory({
    component: DeleteComponent,
    imports: [SharedModule, MockBawApiModule],
    mocks: [ToastrService],
  });

  function setup(model: Project) {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: { project: "resolver" },
        project: { model },
      },
    });

    api = spec.inject(ProjectsService);
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultModel = new Project(generateProject());
  });

  describe("form", () => {
    it("should have no fields", () => {
      setup(defaultModel);
      expect(spec.component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      setup(defaultModel);
      expect(spec.component).toBeTruthy();
    });

    it("should call api", () => {
      setup(defaultModel);
      api.destroy.and.callFake(() => new Subject());
      spec.component.submit({ ...defaultModel });
      expect(api.destroy).toHaveBeenCalledWith(new Project(defaultModel));
    });

    it("should redirect to projects", () => {
      setup(defaultModel);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      spec.component.submit({});
      expect(spec.router.navigateByUrl).toHaveBeenCalledWith(
        projectsMenuItem.route.toRouterLink()
      );
    });
  });
});
