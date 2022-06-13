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
import { BehaviorSubject, Subject } from "rxjs";
import { adminTagGroupsMenuItem } from "../tag-group.menus";
import { AdminTagGroupsDeleteComponent } from "./delete.component";

describe("AdminTagGroupsDeleteComponent", () => {
  let api: SpyObject<TagGroupsService>;
  let defaultModel: TagGroup;
  let spec: SpectatorRouting<AdminTagGroupsDeleteComponent>;
  const createComponent = createRoutingFactory({
    component: AdminTagGroupsDeleteComponent,
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

  describe("form", () => {
    it("should have no fields", () => {
      setup(defaultModel);
      expect(spec.component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      setup(defaultModel);
      expect(spec.component).toBeInstanceOf(AdminTagGroupsDeleteComponent);
    });

    it("should call api", () => {
      setup(defaultModel);
      api.destroy.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to tag group list", () => {
      setup(defaultModel);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      spec.component.submit({});
      expect(spec.router.navigateByUrl).toHaveBeenCalledWith(
        adminTagGroupsMenuItem.route.toRouterLink()
      );
    });
  });
});
