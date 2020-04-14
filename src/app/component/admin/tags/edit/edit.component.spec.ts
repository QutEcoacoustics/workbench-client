import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { tagResolvers, TagsService, TagType } from "@baw-api/tags.service";
import { Tag } from "@models/Tag";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { appLibraryImports } from "src/app/app.module";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { assertResolverErrorHandling } from "src/testHelpers";
import { AdminTagsEditComponent } from "./edit.component";

describe("AdminTagsEditComponent", () => {
  let api: TagsService;
  let component: AdminTagsEditComponent;
  let defaultError: ApiErrorDetails;
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
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminTagsEditComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              tag: tagResolvers.show,
              typeOfTags: tagResolvers.typeOfTags,
            },
            {
              tag: {
                model: tag,
                error: tagError,
              },
              tagTypes: {
                model: tagTypes,
                error: tagTypesError,
              },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTagsEditComponent);
    api = TestBed.inject(TagsService);
    router = TestBed.inject(Router);
    notifications = TestBed.inject(ToastrService);
    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultTag = new Tag({
      id: 1,
      text: "Tag",
    });
    defaultTagTypes = [
      new TagType({
        name: "common_name",
      }),
    ];
    defaultError = {
      status: 401,
      message: "Unauthorized",
    };
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
        defaultError,
        defaultTagTypes,
        undefined
      );
      assertResolverErrorHandling(fixture);
    });

    it("should handle tag types error", () => {
      configureTestingModule(defaultTag, undefined, undefined, defaultError);
      assertResolverErrorHandling(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultTag, undefined, defaultTagTypes, undefined);
      spyOn(api, "update").and.callThrough();
      component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
