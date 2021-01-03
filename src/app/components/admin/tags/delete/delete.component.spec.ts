import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { tagResolvers, TagsService } from "@baw-api/tag/tags.service";
import { Tag } from "@models/Tag";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateTag } from "@test/fakes/Tag";
import { assertErrorHandler } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { adminTagsMenuItem } from "../tags.menus";
import { AdminTagsDeleteComponent } from "./delete.component";

describe("AdminTagsDeleteComponent", () => {
  let api: SpyObject<TagsService>;
  let component: AdminTagsDeleteComponent;
  let defaultTag: Tag;
  let fixture: ComponentFixture<AdminTagsDeleteComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(model: Tag, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AdminTagsDeleteComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { tag: tagResolvers.show },
            { tag: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTagsDeleteComponent);
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
  });

  describe("form", () => {
    it("should have no fields", () => {
      configureTestingModule(defaultTag);
      expect(component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultTag);
      expect(component).toBeTruthy();
    });

    it("should handle tag error", () => {
      configureTestingModule(undefined, generateApiErrorDetails());
      assertErrorHandler(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultTag);
      api.destroy.and.callFake(() => new Subject());
      component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to tag list", () => {
      configureTestingModule(defaultTag);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      component.submit({});
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        adminTagsMenuItem.route.toRouterLink()
      );
    });
  });
});
