import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { tagResolvers, TagsService } from "@baw-api/tag/tags.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { TagType } from "@models/Tag";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastService } from "@services/toasts/toasts.service";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminTagsNewComponent } from "./new.component";

describe("AdminTagsNewComponent", () => {
  let api: SpyObject<TagsService>;
  let component: AdminTagsNewComponent;
  let defaultTagTypes: TagType[];
  let fixture: ComponentFixture<AdminTagsNewComponent>;
  let notifications: ToastService;
  let router: Router;

  function configureTestingModule(model: TagType[], error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule, MockBawApiModule],
      declarations: [AdminTagsNewComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute({ typeOfTags: tagResolvers.tagTypes }, { tagTypes: { model, error } }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTagsNewComponent);
    api = TestBed.inject(TagsService) as SpyObject<TagsService>;
    router = TestBed.inject(Router);
    notifications = TestBed.inject(ToastService);
    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  assertPageInfo(AdminTagsNewComponent, "New Tag");

  beforeEach(() => {
    defaultTagTypes = [
      new TagType({
        name: "common_name",
      }),
    ];
  });

  // xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultTagTypes);
      expect(component).toBeTruthy();
    });

    it("should handle tag types error", () => {
      configureTestingModule(undefined, generateBawApiError());
      assertErrorHandler(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultTagTypes);
      api.create.and.callFake(() => new Subject());
      component.submit({});
      expect(api.create).toHaveBeenCalled();
    });
  });
});
