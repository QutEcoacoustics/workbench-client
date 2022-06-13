import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateTagGroup } from "@test/fakes/TagGroup";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AdminTagGroupsEditComponent } from "./edit.component";

describe("AdminTagGroupsEditComponent", () => {
  let api: SpyObject<TagGroupsService>;
  let defaultModel: TagGroup;
  let spec: SpectatorRouting<AdminTagGroupsEditComponent>;
  const createComponent = createRoutingFactory({
    component: AdminTagGroupsEditComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(model: TagGroup) {
    spec = createComponent({
      data: { resolvers: { tagGroup: "resolver" }, tagGroup: { model } },
    });

    api = spec.inject(TagGroupsService);
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultModel = new TagGroup(generateTagGroup());
  });

  xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      setup(defaultModel);
      expect(spec.component).toBeInstanceOf(AdminTagGroupsEditComponent);
    });

    it("should call api", () => {
      setup(defaultModel);
      api.update.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
