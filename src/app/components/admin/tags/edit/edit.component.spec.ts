import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { tagResolvers, TagsService } from "@baw-api/tag/tags.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Tag, TagType } from "@models/Tag";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateTag } from "@test/fakes/Tag";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastsService } from "@services/toasts/toasts.service";
import { of, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminTagsEditComponent } from "./edit.component";

describe("AdminTagsEditComponent", () => {
  let api: SpyObject<TagsService>;
  let component: AdminTagsEditComponent;
  let defaultTag: Tag;
  let defaultTagTypes: TagType[];
  let fixture: ComponentFixture<AdminTagsEditComponent>;
  let notifications: ToastsService;
  let router: Router;

  function configureTestingModule(
    tag: Tag,
    tagError?: BawApiError,
    tagTypes?: TagType[],
    tagTypesError?: BawApiError
  ) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AdminTagsEditComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
            {
              tag: tagResolvers.show,
              typeOfTags: tagResolvers.tagTypes,
            },
            {
              tag: { model: tag, error: tagError },
              tagTypes: { model: tagTypes, error: tagTypesError },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTagsEditComponent);
    api = TestBed.inject(TagsService) as SpyObject<TagsService>;
    router = TestBed.inject(Router);
    notifications = TestBed.inject(ToastsService);
    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  assertPageInfo(AdminTagsEditComponent, "Edit");

  beforeEach(() => {
    defaultTag = new Tag(generateTag());
    defaultTagTypes = [
      new TagType({
        name: "common_name",
      }),
    ];
  });

  // xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultTag, undefined, defaultTagTypes, undefined);
      expect(component).toBeTruthy();
    });

    it("should handle tag error", () => {
      configureTestingModule(
        undefined,
        generateBawApiError(),
        defaultTagTypes,
        undefined
      );
      assertErrorHandler(fixture);
    });

    it("should handle tag types error", () => {
      configureTestingModule(
        defaultTag,
        undefined,
        undefined,
        generateBawApiError()
      );
      assertErrorHandler(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultTag, undefined, defaultTagTypes, undefined);
      api.update.and.callFake(() => new Subject());
      component.submit({});
      expect(api.update).toHaveBeenCalled();
    });

    describe("delete tag", () => {
      it("should make the correct api calls when the deleteModel() method is called", () => {
        configureTestingModule(defaultTag);
        component.model = defaultTag;
        api.destroy.and.callFake(() => of(null));

        component.deleteModel();
        expect(api.destroy).toHaveBeenCalledWith(defaultTag);
      });

      it("should not navigate when the deleteModel() method succeeds", () => {
        const expectedRoute = "/admin/tags";
        configureTestingModule(defaultTag);
        component.model = defaultTag;
        api.destroy.and.callFake(() => of(null));

        component.deleteModel();

        expect(router.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
      });
    });
  });
});
