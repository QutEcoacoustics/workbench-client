import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastsService } from "@services/toasts/toasts.service";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminTagGroupsNewComponent } from "./new.component";

describe("AdminTagGroupsNewComponent", () => {
  let api: SpyObject<TagGroupsService>;
  let component: AdminTagGroupsNewComponent;
  let fixture: ComponentFixture<AdminTagGroupsNewComponent>;
  let notifications: ToastsService;
  let router: Router;

  assertPageInfo(AdminTagGroupsNewComponent, "New Tag Group")

  // xdescribe("form", () => {});

  describe("component", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          ...appLibraryImports,
          SharedModule,
          RouterTestingModule,
          MockBawApiModule,
        ],
        declarations: [AdminTagGroupsNewComponent],
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
      notifications = TestBed.inject(ToastsService);
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
