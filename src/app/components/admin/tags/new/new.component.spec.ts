import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { TagsService } from "@baw-api/tag/tags.service";
import { TagType } from "@models/Tag";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AdminTagsNewComponent } from "./new.component";

describe("AdminTagsNewComponent", () => {
  let api: SpyObject<TagsService>;
  let defaultTagTypes: TagType[];
  let spec: SpectatorRouting<AdminTagsNewComponent>;
  const createComponent = createRoutingFactory({
    component: AdminTagsNewComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(model: TagType[]) {
    spec = createComponent({
      data: {
        resolvers: { tagTypes: "resolver" },
        tagTypes: { model },
      },
    });

    api = spec.inject(TagsService);
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultTagTypes = [new TagType({ name: "common_name" })];
  });

  xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      setup(defaultTagTypes);
      spec.detectChanges();
      expect(spec.component).toBeInstanceOf(AdminTagsNewComponent);
    });

    it("should call api", () => {
      setup(defaultTagTypes);
      spec.detectChanges();
      api.create.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.create).toHaveBeenCalled();
    });
  });
});
