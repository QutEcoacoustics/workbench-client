import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  tagGroupResolvers,
  TagGroupsService,
} from "@baw-api/tag/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateTagGroup } from "@test/fakes/TagGroup";
import { assertErrorHandler } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { adminTagGroupsMenuItem } from "../tag-group.menus";
import { AdminTagGroupsDeleteComponent } from "./delete.component";

describe("AdminTagGroupsDeleteComponent", () => {
  let api: SpyObject<TagGroupsService>;
  let component: AdminTagGroupsDeleteComponent;
  let defaultTagGroup: TagGroup;
  let fixture: ComponentFixture<AdminTagGroupsDeleteComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(model: TagGroup, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AdminTagGroupsDeleteComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
            { tagGroup: tagGroupResolvers.show },
            { tagGroup: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTagGroupsDeleteComponent);
    api = TestBed.inject(TagGroupsService) as SpyObject<TagGroupsService>;
    router = TestBed.inject(Router);
    notifications = TestBed.inject(ToastrService);
    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultTagGroup = new TagGroup(generateTagGroup());
  });

  describe("form", () => {
    it("should have no fields", () => {
      configureTestingModule(defaultTagGroup);
      expect(component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultTagGroup);
      expect(component).toBeTruthy();
    });

    it("should handle tag group error", () => {
      configureTestingModule(undefined, generateApiErrorDetails());
      assertErrorHandler(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultTagGroup);
      api.destroy.and.callFake(() => new Subject());
      component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to tag group list", () => {
      configureTestingModule(defaultTagGroup);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      component.submit({});
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        adminTagGroupsMenuItem.route.toRouterLink()
      );
    });
  });
});
