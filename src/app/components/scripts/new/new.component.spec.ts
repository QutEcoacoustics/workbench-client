import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { SpyObject } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastService } from "@services/toasts/toasts.service";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.config";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AdminScriptsNewComponent } from "./new.component";

describe("AdminScriptsNewComponent", () => {
  let api: SpyObject<ScriptsService>;
  let component: AdminScriptsNewComponent;
  let fixture: ComponentFixture<AdminScriptsNewComponent>;
  let notifications: ToastService;
  let router: Router;

  assertPageInfo(AdminScriptsNewComponent, "New Script");

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,

        AdminScriptsNewComponent,
      ],
      providers: [provideMockBawApi(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminScriptsNewComponent);
    api = TestBed.inject(ScriptsService) as SpyObject<ScriptsService>;
    router = TestBed.inject(Router);
    notifications = TestBed.inject(ToastService);
    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  });

  // xdescribe("form", () => {});

  describe("component", () => {
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
