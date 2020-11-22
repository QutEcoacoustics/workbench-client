import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { tagResolvers, TagsService } from "@baw-api/tag/tags.service";
import { Tag, TagType } from "@models/Tag";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateTag } from "@test/fakes/Tag";
import { assertErrorHandler } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminTagsEditComponent } from "./edit.component";

describe("AdminTagsEditComponent", () => {
  let api: SpyObject<TagsService>;
  let component: AdminTagsEditComponent;
  let defaultTag: Tag;
  let defaultTagTypes: TagType[];
  let fixture: ComponentFixture<AdminTagsEditComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(
    tag: Tag,
    tagError: ApiErrorDetails,
    tagTypes: TagType[],
    tagTypesError: ApiErrorDetails
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
          useClass: mockActivatedRoute(
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
    notifications = TestBed.inject(ToastrService);
    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultTag = new Tag(generateTag());
    defaultTagTypes = [
      new TagType({
        name: "common_name",
      }),
    ];
  });

  xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultTag, undefined, defaultTagTypes, undefined);
      expect(component).toBeTruthy();
    });

    it("should handle tag error", () => {
      configureTestingModule(
        undefined,
        generateApiErrorDetails(),
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
        generateApiErrorDetails()
      );
      assertErrorHandler(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultTag, undefined, defaultTagTypes, undefined);
      api.update.and.callFake(() => new Subject());
      component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
