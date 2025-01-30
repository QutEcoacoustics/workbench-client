import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  scriptResolvers,
  ScriptsService,
} from "@baw-api/script/scripts.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Script } from "@models/Script";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateScript } from "@test/fakes/Script";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminScriptsEditComponent } from "./edit.component";

describe("AdminScriptsEditComponent", () => {
  let api: SpyObject<ScriptsService>;
  let component: AdminScriptsEditComponent;
  let defaultModel: Script;
  let fixture: ComponentFixture<AdminScriptsEditComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(model: Script, error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AdminScriptsEditComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
            { script: scriptResolvers.show },
            { script: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminScriptsEditComponent);
    api = TestBed.inject(ScriptsService) as SpyObject<ScriptsService>;
    router = TestBed.inject(Router);
    notifications = TestBed.inject(ToastrService);
    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  assertPageInfo<Script>(AdminScriptsEditComponent, "Edit");

  beforeEach(() => {
    defaultModel = new Script(generateScript());
  });

  // xdescribe("form", () => {});

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultModel);
      expect(component).toBeTruthy();
    });

    it("should handle script error", () => {
      configureTestingModule(undefined, generateBawApiError());
      assertErrorHandler(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultModel);
      api.update.and.callFake(() => new Subject());
      component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
