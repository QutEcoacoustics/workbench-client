import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { testFormlyFields } from "@test/helpers/formly";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import schema from "../../project.schema.json";
import { NewComponent } from "./new.component";

describe("ProjectsNewComponent", () => {
  let api: SpyObject<ProjectsService>;
  let spec: SpectatorRouting<NewComponent>;
  const createComponent = createRoutingFactory({
    component: NewComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });
  const { fields } = schema;

  function setup() {
    spec = createComponent();
    api = spec.inject(ProjectsService);
    spec.detectChanges();
  }

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
      setup();
      expect(spec.component).toBeTruthy();
    });

    it("should call api", () => {
      setup();
      api.create.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.create).toHaveBeenCalled();
    });
  });
});
