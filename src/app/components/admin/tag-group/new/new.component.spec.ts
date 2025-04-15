import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { SpyObject } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastService } from "@services/toasts/toasts.service";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminTagGroupsNewComponent } from "./new.component";

describe("AdminTagGroupsNewComponent", () => {
  let api: SpyObject<TagGroupsService>;
  let component: AdminTagGroupsNewComponent;
  let fixture: ComponentFixture<AdminTagGroupsNewComponent>;
  let notifications: ToastService;
  let router: Router;

  assertPageInfo(AdminTagGroupsNewComponent, "New Tag Group");

  // xdescribe("form", () => {});

  describe("component", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          ...appLibraryImports,
          MockBawApiModule,
          AdminTagGroupsNewComponent,
        ],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: mockActivatedRoute(),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AdminTagGroupsNewComponent);
      api = TestBed.inject(TagGroupsService) as SpyObject<TagGroupsService>;
      router = TestBed.inject(Router);
      notifications = TestBed.inject(ToastService);
      component = fixture.componentInstance;

      spyOn(notifications, "success").and.stub();
      spyOn(notifications, "error").and.stub();
      spyOn(router, "navigateByUrl").and.stub();

      fixture.detectChanges();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should call api", () => {
      api.create.and.callFake(() => new Subject());
      component.submit({});
      expect(api.create).toHaveBeenCalled();
    });
  });
});
