import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { tagResolvers, TagsService } from "@baw-api/tags.service";
import { Tag } from "@models/Tag";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { assertFormErrorHandling } from "src/testHelpers";
import { adminTagsMenuItem } from "../tags.menus";
import { AdminTagsDeleteComponent } from "./delete.component";

describe("AdminTagsDeleteComponent", () => {
  let api: TagsService;
  let component: AdminTagsDeleteComponent;
  let defaultError: ApiErrorDetails;
  let defaultTag: Tag;
  let fixture: ComponentFixture<AdminTagsDeleteComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(tag: Tag, tagError: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminTagsDeleteComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              tag: tagResolvers.show,
            },
            {
              tag: {
                model: tag,
                error: tagError,
              },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTagsDeleteComponent);
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
    defaultError = {
      status: 401,
      message: "Unauthorized",
    };
  });

  describe("form", () => {
    it("should have no fields", () => {
      configureTestingModule(defaultTag, undefined);
      expect(component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultTag, undefined);
      expect(component).toBeTruthy();
    });

    it("should handle tag error", () => {
      configureTestingModule(undefined, defaultError);
      assertFormErrorHandling(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultTag, undefined);
      spyOn(api, "destroy").and.callThrough();
      component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to tag list", () => {
      configureTestingModule(defaultTag, undefined);
      spyOn(api, "destroy").and.callFake(() => new BehaviorSubject<void>(null));

      component.submit({});
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        adminTagsMenuItem.route.toString()
      );
    });
  });
});
