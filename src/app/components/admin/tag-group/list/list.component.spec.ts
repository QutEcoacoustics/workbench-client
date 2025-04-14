import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { SpyObject } from "@ngneat/spectator";
import { generateTagGroup } from "@test/fakes/TagGroup";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { ToastService } from "@services/toasts/toasts.service";
import { of } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminTagGroupsComponent } from "./list.component";

describe("AdminTagGroupsComponent", () => {
  let api: TagGroupsService;
  let defaultModels: TagGroup[];
  let fixture: ComponentFixture<AdminTagGroupsComponent>;
  let tagGroupApiSpy: SpyObject<TagGroupsService>;
  let modalService: SpyObject<NgbModal>;
  let modalConfigService: SpyObject<NgbModalConfig>;


  beforeEach(function () {
    TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        ...appLibraryImports,
        MockBawApiModule,
        AdminTagGroupsComponent,
    ],
}).compileComponents();

    TestBed.inject(ToastService);
    fixture = TestBed.createComponent(AdminTagGroupsComponent);
    api = TestBed.inject(TagGroupsService);

    tagGroupApiSpy = TestBed.inject(TagGroupsService) as SpyObject<TagGroupsService>;
    modalService = TestBed.inject(NgbModal) as SpyObject<NgbModal>;

    // inject the bootstrap modal config service so that we can disable animations
    // this is needed so that buttons can be clicked without waiting for the async animation
    modalConfigService = TestBed.inject(NgbModalConfig) as SpyObject<NgbModalConfig>;
    modalConfigService.animation = false;

    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new TagGroup(generateTagGroup()));
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  assertPagination<TagGroup, TagGroupsService>();

  assertPageInfo(AdminTagGroupsComponent, "Tag Group");

  it("should create", () => {
    expect(fixture.componentInstance).toBeInstanceOf(AdminTagGroupsComponent);
  });

  describe("delete tag-group", () => {
    afterEach(() => modalService.dismissAll());

    it("should display a modal when confirmTagGroupDeletion() is called", () => {
      const mockTagGroup = new TagGroup(generateTagGroup());
      tagGroupApiSpy.destroy.and.returnValue(of(null));

      fixture.componentInstance.confirmTagGroupDeletion(undefined, mockTagGroup);

      expect(modalService.hasOpenModals()).toBeTrue();
    });

    it("should make the correct api calls when confirmTagGroupDeletion() is successful", fakeAsync(() => {
      const mockTagGroup = new TagGroup(generateTagGroup());
      tagGroupApiSpy.destroy.and.returnValue(of(null));

      // since there is a confirmation modal before the api call, we need to open & confirm the modal before asserting api call parameters
      spyOn(modalService, "open").and.returnValue({
        result: new Promise((resolve) => resolve(true))
      });
      fixture.componentInstance.confirmTagGroupDeletion(null, mockTagGroup);

      tick();

      expect(tagGroupApiSpy.destroy).toHaveBeenCalledWith(mockTagGroup);
    }));
  });

  // TODO Write tests
  // xdescribe("rows", () => {});
  // xdescribe("actions", () => {});
});
