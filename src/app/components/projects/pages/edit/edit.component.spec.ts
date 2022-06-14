import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { testFormlyFields } from "@test/helpers/formly";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import schema from "../../project.schema.json";
import { EditComponent } from "./edit.component";

describe("ProjectsEditComponent", () => {
  let api: SpyObject<ProjectsService>;
  let defaultModel: Project;
  let spec: SpectatorRouting<EditComponent>;
  const createComponent = createRoutingFactory({
    component: EditComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });
  const { fields } = schema;

  function setup(model: Project) {
    spec = createComponent({
      data: { resolvers: { project: "resolver" }, project: { model } },
    });

    api = spec.inject(ProjectsService);
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultModel = new Project(generateProject());
  });

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Project Name Input",
        field: fields[0],
        key: "name",
        label: "Project Name",
        type: "input",
        inputType: "text",
        required: true,
      },
      {
        testGroup: "Project Description Input",
        field: fields[1],
        key: "description",
        label: "Description",
        type: "textarea",
      },
      {
        testGroup: "Project Image Input",
        field: fields[2],
        key: "image",
        label: "Image",
        type: "image",
      },
    ]);
  });

  describe("component", () => {
    it("should create", () => {
      setup(defaultModel);
      expect(spec.component).toBeTruthy();
    });

    it("should call api", () => {
      setup(defaultModel);
      api.update.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
