import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { TagsService } from "@baw-api/tag/tags.service";
import { Tag } from "@models/Tag";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateTag } from "@test/fakes/Tag";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { ToastService } from "@services/toasts/toasts.service";
import { of } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminTagsComponent } from "./list.component";

describe("AdminTagsComponent", () => {
  let api: TagsService;
  let defaultModels: Tag[];
  let fixture: ComponentFixture<AdminTagsComponent>;
  let tagsApiSpy: SpyObject<TagsService>;
  let modalService: SpyObject<NgbModal>;
  let modalConfigService: SpyObject<NgbModalConfig>;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AdminTagsComponent],
    }).compileComponents();

    TestBed.inject(ToastService)
    fixture = TestBed.createComponent(AdminTagsComponent);
    api = TestBed.inject(TagsService);

    tagsApiSpy = TestBed.inject(TagsService) as SpyObject<TagsService>;
    modalService = TestBed.inject(NgbModal) as SpyObject<NgbModal>;

    // inject the bootstrap modal config service so that we can disable animations
    // this is needed so that buttons can be clicked without waiting for the async animation
    modalConfigService = TestBed.inject(NgbModalConfig) as SpyObject<NgbModalConfig>;
    modalConfigService.animation = false;

    defaultModels = [];
    for (let id = 0; id < defaultApiPageSize; id++) {
      defaultModels.push(new Tag(generateTag({ id })));
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  assertPagination<Tag, TagsService>();

  assertPageInfo(AdminTagsComponent, "Tags");

  it("should create", () => {
    expect(fixture.componentInstance).toBeInstanceOf(AdminTagsComponent);
  });

  describe("delete tag", () => {
    afterEach(() => modalService.dismissAll());

    it("should display a modal when confirmTagDeletion() is called", () => {
      const mockTag = new Tag(generateTag());
      tagsApiSpy.destroy.and.returnValue(of(null));

      fixture.componentInstance.confirmTagDeletion(undefined, mockTag);

      expect(modalService.hasOpenModals()).toBeTrue();
    });

    it("should make the correct api calls when confirmTagDeletion() is successful", fakeAsync(() => {
      const mockTag = new Tag(generateTag());
      tagsApiSpy.destroy.and.returnValue(of(null));

      // since there is a confirmation modal before the api call, we need to open & confirm the modal before asserting api call parameters
      spyOn(modalService, "open").and.returnValue({
        result: new Promise((resolve) => resolve(true))
      });
      fixture.componentInstance.confirmTagDeletion(null, mockTag);

      tick();

      expect(tagsApiSpy.destroy).toHaveBeenCalledWith(mockTag);
    }));
  });

  // TODO Write tests
  // xdescribe("rows", () => {});
  // xdescribe("actions", () => {});
});
