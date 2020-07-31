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
import { assertResolverErrorHandling } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { adminTagGroupsMenuItem } from "../tag-group.menus";
import { AdminTagGroupsDeleteComponent } from "./delete.component";

describe("AdminTagGroupsDeleteComponent", () => {
  let api: SpyObject<TagGroupsService>;
  let component: AdminTagGroupsDeleteComponent;
  let defaultError: ApiErrorDetails;
  let defaultTagGroup: TagGroup;
  let fixture: ComponentFixture<AdminTagGroupsDeleteComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(tagGroup: TagGroup, error: ApiErrorDetails) {
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
          useClass: mockActivatedRoute(
            { tagGroup: tagGroupResolvers.show },
            { tagGroup: { model: tagGroup, error } }
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

  describe("form", () => {
    it("should have no fields", () => {
      configureTestingModule(defaultTagGroup, undefined);
      expect(component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultTagGroup, undefined);
      expect(component).toBeTruthy();
    });

    it("should handle tag group error", () => {
      configureTestingModule(undefined, defaultError);
      assertResolverErrorHandling(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultTagGroup, undefined);
      api.destroy.and.callFake(() => new Subject());
      component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to tag group list", () => {
      configureTestingModule(defaultTagGroup, undefined);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      component.submit({});
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        adminTagGroupsMenuItem.route.toString()
      );
    });
  });
});
