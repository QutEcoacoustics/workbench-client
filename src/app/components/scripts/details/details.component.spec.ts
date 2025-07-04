import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import {
  scriptResolvers,
  ScriptsService,
} from "@baw-api/script/scripts.service";
import {
  ACCOUNT,
  AUDIO_EVENT_PROVENANCE,
  SCRIPT,
} from "@baw-api/ServiceTokens";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Script } from "@models/Script";
import { User } from "@models/User";
import { SpyObject } from "@ngneat/spectator";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateScript } from "@test/fakes/Script";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { nStepObservable } from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import { appLibraryImports } from "src/app/app.config";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { AdminScriptComponent } from "./details.component";

describe("ScriptComponent", () => {
  let component: AdminScriptComponent;
  let fixture: ComponentFixture<AdminScriptComponent>;
  let injector: AssociationInjector;

  function configureTestingModule(model: Script, error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, AdminScriptComponent],
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

    fixture = TestBed.createComponent(AdminScriptComponent);
    injector = TestBed.inject(ASSOCIATION_INJECTOR);

    const accountsApi = TestBed.inject(
      ACCOUNT.token,
    ) as SpyObject<AccountsService>;
    const scriptsApi = TestBed.inject(
      SCRIPT.token,
    ) as SpyObject<ScriptsService>;
    const provenanceApi = TestBed.inject(
      AUDIO_EVENT_PROVENANCE.token,
    ) as SpyObject<AudioEventProvenanceService>;

    component = fixture.componentInstance;

    const accountsSubject = new Subject<User>();
    accountsApi.show.and.callFake(() => accountsSubject);
    const scriptsSubject = new Subject<Script>();
    scriptsApi.show.and.callFake(() => scriptsSubject);
    const provenanceSubject = new Subject<AudioEventProvenance>();
    provenanceApi.show.andCallFake(() => provenanceSubject);

    // Update model to contain injector
    if (model) {
      model["injector"] = injector;
    }

    return Promise.all([
      nStepObservable(
        accountsSubject,
        () => new User({ id: 1, userName: "custom username" }),
      ),
      nStepObservable(
        scriptsSubject,
        () => new Script({ id: 1, name: "custom script" }),
      ),
      nStepObservable(
        provenanceSubject,
        () =>
          new AudioEventProvenance(
            generateAudioEventProvenance({
              id: 1,
              name: "BirdNET",
              version: "2.4",
            }),
          ),
      ),
    ]);
  }

  assertPageInfo<Script>(AdminScriptComponent, "Test Script", {
    script: {
      model: new Script(generateScript({ name: "Test Script" })),
    },
  });

  it("should create", () => {
    configureTestingModule(new Script(generateScript()));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle error", () => {
    configureTestingModule(undefined, generateBawApiError());
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
      { label: "Verified", key: "verified", checkbox: model.verified },
      {
        label: "Is Last Version",
        key: "isLastVersion",
        checkbox: model.isLastVersion,
      },
      {
        label: "Is First Version",
        key: "isFirstVersion",
        checkbox: model.isFirstVersion,
      },
      { label: "Group Id", key: "groupId", plain: model.groupId },
      {
        label: "Provenance Id",
        key: "provenanceId",
        plain: model.provenanceId,
      },
      { label: "Group", key: "group", model: "Script: custom script (1)" },
      { label: "Creator", key: "creator", model: "User: custom username (1)" },
      { label: "Created At", key: "createdAt", dateTime: model.createdAt },
    ];

    details.forEach((detail) => assertDetail(detail));
  });
});
