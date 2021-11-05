import { Injector } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  scriptResolvers,
  ScriptsService,
} from "@baw-api/script/scripts.service";
import { ACCOUNT, SCRIPT } from "@baw-api/ServiceTokens";
import { Script } from "@models/Script";
import { User } from "@models/User";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateScript } from "@test/fakes/Script";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { nStepObservable } from "@test/helpers/general";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminScriptComponent } from "./details.component";

describe("ScriptComponent", () => {
  let component: AdminScriptComponent;
  let fixture: ComponentFixture<AdminScriptComponent>;
  let injector: Injector;

  function configureTestingModule(model: Script, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AdminScriptComponent],
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

    fixture = TestBed.createComponent(AdminScriptComponent);
    injector = TestBed.inject(Injector);
    const accountsApi = TestBed.inject(
      ACCOUNT.token
    ) as SpyObject<AccountsService>;
    const scriptsApi = TestBed.inject(
      SCRIPT.token
    ) as SpyObject<ScriptsService>;
    component = fixture.componentInstance;

    const accountsSubject = new Subject<User>();
    accountsApi.show.and.callFake(() => accountsSubject);
    const scriptsSubject = new Subject<Script>();
    scriptsApi.show.and.callFake(() => scriptsSubject);

    // Update model to contain injector
    if (model) {
      model["injector"] = injector;
    }

    return Promise.all([
      nStepObservable(
        accountsSubject,
        () => new User({ id: 1, userName: "custom username" })
      ),
      nStepObservable(
        scriptsSubject,
        () => new Script({ id: 1, name: "custom script" })
      ),
    ]);
  }

  it("should create", () => {
    configureTestingModule(new Script(generateScript()));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle error", () => {
    configureTestingModule(undefined, generateApiErrorDetails());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("details", () => {
    const model = new Script(generateScript());

    beforeEach(async function () {
      const promise = configureTestingModule(model);
      fixture.detectChanges();
      await promise;
      fixture.detectChanges();
      this.fixture = fixture;
    });

    const details: Detail[] = [
      { label: "Script Id", key: "id", plain: model.id },
      { label: "Name", key: "name", plain: model.name },
      { label: "Description", key: "description", plain: model.description },
      { label: "Version", key: "version", plain: model.version },
      {
        label: "Analysis Identifier",
        key: "analysisIdentifier",
        plain: model.analysisIdentifier,
      },
      {
        label: "Executable Command",
        key: "executableCommand",
        plain: model.executableCommand,
      },
      {
        label: "Executable Settings",
        key: "executableSettings",
        plain: model.executableSettings,
      },
      {
        label: "Executable Settings Media Type",
        key: "executableSettingsMediaType",
        plain: model.executableSettingsMediaType,
      },
      {
        label: "Analysis Action Parameters",
        key: "analysisActionParams",
        code: model.analysisActionParams,
      },
      { label: "Verified", key: "verified", checkbox: model.verified },
      { label: "Group Id", key: "groupId", plain: model.groupId },
      { label: "Group", key: "group", model: "script: custom script (1)" },
      { label: "Creator", key: "creator", model: "user: custom username (1)" },
      { label: "Created At", key: "createdAt", plain: model.createdAt },
    ];

    details.forEach((detail) => assertDetail(detail));
  });
});
