import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AdminTagGroupsNewComponent } from "./new.component";

describe("AdminTagGroupsNewComponent", () => {
  let api: SpyObject<TagGroupsService>;
  let spec: SpectatorRouting<AdminTagGroupsNewComponent>;
  const createComponent = createRoutingFactory({
    component: AdminTagGroupsNewComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });

  function setup() {
    spec = createComponent();
    api = spec.inject(TagGroupsService);
    spec.detectChanges();
  }

  xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      setup();
      expect(spec.component).toBeInstanceOf(AdminTagGroupsNewComponent);
    });

    it("should call api", () => {
      setup();
      api.create.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.create).toHaveBeenCalled();
    });
  });
});
