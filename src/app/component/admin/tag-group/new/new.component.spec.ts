import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { SharedModule } from "@shared/shared.module";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { appLibraryImports } from "src/app/app.module";
import { AdminTagGroupsNewComponent } from "./new.component";

describe("AdminTagGroupsNewComponent", () => {
  let api: TagGroupsService;
  let component: AdminTagGroupsNewComponent;
  let fixture: ComponentFixture<AdminTagGroupsNewComponent>;
  let notifications: ToastrService;
  let router: Router;

  xdescribe("form", () => {});

  describe("component", () => {
    beforeEach(async(() => {
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
            useClass: mockActivatedRoute(),
          },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AdminTagGroupsNewComponent);
      api = TestBed.inject(TagGroupsService);
      router = TestBed.inject(Router);
      notifications = TestBed.inject(ToastrService);
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
      spyOn(api, "create").and.callThrough();
      component.submit({});
      expect(api.create).toHaveBeenCalled();
    });
  });
});
