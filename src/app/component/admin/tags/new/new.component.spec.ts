import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { tagResolvers, TagsService } from "@baw-api/tags.service";
import { TagType } from "@models/Tag";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { appLibraryImports } from "src/app/app.module";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { assertResolverErrorHandling } from "src/testHelpers";
import { AdminTagsNewComponent } from "./new.component";

describe("AdminTagsNewComponent", () => {
  let api: TagsService;
  let component: AdminTagsNewComponent;
  let defaultError: ApiErrorDetails;
  let defaultTagTypes: TagType[];
  let fixture: ComponentFixture<AdminTagsNewComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(
    tagTypes: TagType[],
    tagTypesError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminTagsNewComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              typeOfTags: tagResolvers.tagTypes,
            },
            {
              tagTypes: {
                model: tagTypes,
                error: tagTypesError,
              },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTagsNewComponent);
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
      configureTestingModule(defaultTagTypes, undefined);
      expect(component).toBeTruthy();
    });

    it("should handle tag types error", () => {
      configureTestingModule(undefined, defaultError);
      assertResolverErrorHandling(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultTagTypes, undefined);
      spyOn(api, "create").and.callThrough();
      component.submit({});
      expect(api.create).toHaveBeenCalled();
    });
  });
});
