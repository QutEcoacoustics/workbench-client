import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { ProvenanceService } from "@baw-api/provenance/provenance.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import {
  scriptResolvers,
  ScriptsService,
} from "@baw-api/script/scripts.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { AssociationInjector } from "@models/ImplementsInjector";
import { Script } from "@models/Script";
import { SpyObject } from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { ToastService } from "@services/toasts/toasts.service";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateScript } from "@test/fakes/Script";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { of, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.config";
import { AdminScriptsEditComponent } from "./edit.component";

describe("AdminScriptsEditComponent", () => {
  let api: SpyObject<ScriptsService>;
  let provenanceApi: SpyObject<ProvenanceService>;

  let component: AdminScriptsEditComponent;
  let defaultModel: Script;
  let fixture: ComponentFixture<AdminScriptsEditComponent>;
  let notifications: ToastService;
  let router: Router;
  let injector: AssociationInjector;

  function configureTestingModule(model?: Script, error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, AdminScriptsEditComponent],
      providers: [
        provideMockBawApi(),
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
            { script: scriptResolvers.show },
            { script: { model, error } },
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminScriptsEditComponent);
    router = TestBed.inject(Router);
    notifications = TestBed.inject(ToastService);

    api = TestBed.inject(ScriptsService) as SpyObject<ScriptsService>;
    provenanceApi = TestBed.inject(
      ProvenanceService,
    ) as SpyObject<ProvenanceService>;

    injector = TestBed.inject(ASSOCIATION_INJECTOR);
    if (model) {
      model["injector"] = injector;
    }

    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    provenanceApi.show.and.returnValue(of());

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
