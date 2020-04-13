import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { tagGroupResolvers, TagGroupService } from "@baw-api/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { appLibraryImports } from "src/app/app.module";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { assertFormErrorHandling } from "src/testHelpers";
import { AdminTagGroupsEditComponent } from "./edit.component";

describe("AdminTagGroupsEditComponent", () => {
  let api: TagGroupService;
  let component: AdminTagGroupsEditComponent;
  let defaultError: ApiErrorDetails;
  let defaultTagGroup: TagGroup;
  let fixture: ComponentFixture<AdminTagGroupsEditComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(tagGroup: TagGroup, error: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminTagGroupsEditComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              tagGroup: tagGroupResolvers.show,
            },
            {
              tagGroup: {
                model: tagGroup,
                error,
              },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTagGroupsEditComponent);
    api = TestBed.inject(TagGroupService);
    router = TestBed.inject(Router);
    notifications = TestBed.inject(ToastrService);
    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultTagGroup = new TagGroup({
      id: 1,
      groupIdentifier: "Group Identifier",
      tagId: 1,
    });
    defaultError = {
      status: 401,
      message: "Unauthorized",
    };
  });

  xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultTagGroup, undefined);
      expect(component).toBeTruthy();
    });

    it("should handle tag group error", () => {
      configureTestingModule(undefined, defaultError);
      assertFormErrorHandling(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultTagGroup, undefined);
      spyOn(api, "update").and.callThrough();
      component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
