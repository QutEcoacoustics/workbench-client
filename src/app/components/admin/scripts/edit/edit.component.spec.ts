import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { Script } from "@models/Script";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateScript } from "@test/fakes/Script";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AdminScriptsEditComponent } from "./edit.component";

describe("AdminScriptsEditComponent", () => {
  let api: SpyObject<ScriptsService>;
  let defaultModel: Script;
  let spec: SpectatorRouting<AdminScriptsEditComponent>;
  const createComponent = createRoutingFactory({
    component: AdminScriptsEditComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(model: Script) {
    spec = createComponent({
      data: { resolvers: { script: "resolver" }, script: { model } },
    });

    api = spec.inject(ScriptsService);
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultModel = new Script(generateScript());
  });

  xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      setup(defaultModel);
      expect(spec.component).toBeInstanceOf(AdminScriptsEditComponent);
    });

    it("should call api", () => {
      setup(defaultModel);
      api.update.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
