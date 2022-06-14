import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { TagsService } from "@baw-api/tag/tags.service";
import { Tag, TagType } from "@models/Tag";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateTag } from "@test/fakes/Tag";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AdminTagsEditComponent } from "./edit.component";

describe("AdminTagsEditComponent", () => {
  let api: SpyObject<TagsService>;
  let defaultTag: Tag;
  let defaultTagTypes: TagType[];
  let spec: SpectatorRouting<AdminTagsEditComponent>;
  const createComponent = createRoutingFactory({
    component: AdminTagsEditComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(tag: Tag, tagTypes: TagType[]) {
    spec = createComponent({
      data: {
        resolvers: { tagTypes: "resolver", tag: "resolver" },
        tagTypes: { model: tagTypes },
        tag: { model: tag },
      },
    });

    api = spec.inject(TagsService);
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultTag = new Tag(generateTag());
    defaultTagTypes = [new TagType({ name: "common_name" })];
  });

  xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      setup(defaultTag, defaultTagTypes);
      expect(spec.component).toBeInstanceOf(AdminTagsEditComponent);
    });

    it("should call api", () => {
      setup(defaultTag, defaultTagTypes);
      api.update.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
