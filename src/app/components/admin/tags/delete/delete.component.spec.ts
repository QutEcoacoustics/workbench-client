import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { TagsService } from "@baw-api/tag/tags.service";
import { Tag } from "@models/Tag";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateTag } from "@test/fakes/Tag";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { adminTagsMenuItem } from "../tags.menus";
import { AdminTagsDeleteComponent } from "./delete.component";

describe("AdminTagsDeleteComponent", () => {
  let api: SpyObject<TagsService>;
  let defaultModel: Tag;
  let spec: SpectatorRouting<AdminTagsDeleteComponent>;
  const createComponent = createRoutingFactory({
    component: AdminTagsDeleteComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(model: Tag) {
    spec = createComponent({
      data: { resolvers: { tag: "resolver" }, tag: { model } },
    });

    api = spec.inject(TagsService);
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultModel = new Tag(generateTag());
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
      spec.component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to tag list", () => {
      setup(defaultModel);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      spec.component.submit({});
      expect(spec.router.navigateByUrl).toHaveBeenCalledWith(
        adminTagsMenuItem.route.toRouterLink()
      );
    });
  });
});
