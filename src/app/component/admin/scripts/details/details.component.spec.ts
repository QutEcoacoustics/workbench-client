import { Injector } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { scriptResolvers } from "@baw-api/script/scripts.service";
import { ACCOUNT } from "@baw-api/ServiceTokens";
import { Script } from "@models/Script";
import { User } from "@models/User";
import { humanizeDateTime } from "@shared/detail-view/render-field/render-field.component";
import { SharedModule } from "@shared/shared.module";
import { assertDetailView } from "@test/helpers/detail-view";
import { nStepObservable } from "@test/helpers/general";
import { mockActivatedRoute, testBawServices } from "@test/helpers/testbed";
import { DateTime } from "luxon";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminScriptComponent } from "./details.component";

describe("ScriptComponent", () => {
  let component: AdminScriptComponent;
  let fixture: ComponentFixture<AdminScriptComponent>;
  let injector: Injector;

  function configureTestingModule(model: Script, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminScriptComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { script: scriptResolvers.show },
            { script: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminScriptComponent);
    injector = TestBed.inject(Injector);
    const accountsApi = TestBed.inject(ACCOUNT.token);
    component = fixture.componentInstance;

    const subject = new Subject<User>();
    const promise = nStepObservable(
      subject,
      () => new User({ id: 1, userName: "custom username" })
    );
    spyOn(accountsApi, "show").and.callFake(() => subject);

    // Update model to contain injector
    if (model) {
      model["injector"] = injector;
    }

    return promise;
  }

  it("should create", () => {
    configureTestingModule(
      new Script({
        id: 1,
      })
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle error", () => {
    configureTestingModule(undefined, {
      status: 401,
      message: "Unauthorized",
    } as ApiErrorDetails);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("details", () => {
    const createdAt = DateTime.fromISO("2010-02-01T21:00:00.000+15:00", {
      setZone: true,
    });

    beforeEach(async function () {
      const model = new Script({
        id: 1,
        name: "custom script",
        description: "custom description",
        analysisIdentifier: "audio2csv",
        version: 0.1,
        verified: true,
        groupId: 1,
        creatorId: 1,
        createdAt: createdAt.toISO(),
        executableCommand: "executable command",
        executableSettings: "executable settings",
        executableSettingsMediaType: "text/json",
        analysisActionParams: "custom parameters",
      });

      const promise = configureTestingModule(model);
      fixture.detectChanges();
      await promise;
      fixture.detectChanges();
      this.fixture = fixture;
    });

    assertDetailView("Script Id", "id", "1");
    assertDetailView("Name", "name", "custom script");
    assertDetailView("Description", "description", "custom description");
    assertDetailView("Version", "version", "0.1");
    assertDetailView("Analysis Identifier", "analysisIdentifier", "audio2csv");
    assertDetailView(
      "Executable Command",
      "executableCommand",
      "executable command"
    );
    assertDetailView(
      "Executable Settings",
      "executableSettings",
      "executable settings"
    );
    assertDetailView(
      "Executable Settings Media Type",
      "executableSettingsMediaType",
      "text/json"
    );
    assertDetailView(
      "Analysis Action Parameters",
      "analysisActionParams",
      "custom parameters"
    );
    assertDetailView("Verified", "verified", true);
    assertDetailView("Group Id", "groupId", "1");
    assertDetailView("Creator", "creatorId", "User: custom username (1)");
    assertDetailView("Created At", "createdAt", humanizeDateTime(createdAt));
  });
});
