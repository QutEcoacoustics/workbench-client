import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ScriptsService } from "@baw-api/script/scripts.service";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AdminScriptsNewComponent } from "./new.component";

describe("AdminScriptsNewComponent", () => {
  let api: SpyObject<ScriptsService>;
  let spec: SpectatorRouting<AdminScriptsNewComponent>;
  const createComponent = createRoutingFactory({
    component: AdminScriptsNewComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });

  function setup() {
    spec = createComponent();
    api = spec.inject(ScriptsService);
    spec.detectChanges();
  }

  xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      setup();
      expect(spec.component).toBeInstanceOf(AdminScriptsNewComponent);
    });

    it("should call api", () => {
      setup();
      api.create.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.create).toHaveBeenCalled();
    });
  });
});
