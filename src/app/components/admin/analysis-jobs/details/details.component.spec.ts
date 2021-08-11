import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ACCOUNT, SAVED_SEARCH, SCRIPT } from "@baw-api/ServiceTokens";
import { AnalysisJob } from "@models/AnalysisJob";
import { SavedSearch } from "@models/SavedSearch";
import { Script } from "@models/Script";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateSavedSearch } from "@test/fakes/SavedSearch";
import { generateScript } from "@test/fakes/Script";
import { generateUser } from "@test/fakes/User";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { nStepObservable } from "@test/helpers/general";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { AdminAnalysisJobComponent } from "./details.component";

describe("AdminAnalysisJobComponent", () => {
  let injector: Injector;
  let spec: Spectator<AdminAnalysisJobComponent>;
  const createComponent = createComponentFactory({
    component: AdminAnalysisJobComponent,
    imports: [SharedModule, MockBawApiModule, RouterTestingModule],
  });

  function setup(model: AnalysisJob, error?: ApiErrorDetails) {
    spec = createComponent({
      detectChanges: false,
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
            { analysisJob: "resolver" },
            { analysisJob: { model, error } }
          ),
        },
      ],
    });

    injector = spec.inject(Injector);
    const accountsApi = spec.inject(ACCOUNT.token);
    const scriptsApi = spec.inject(SCRIPT.token);
    const savedSearchesApi = spec.inject(SAVED_SEARCH.token);

    const accountsSubject = new Subject<User>();
    const scriptsSubject = new Subject<Script>();
    const savedSearchesSubject = new Subject<SavedSearch>();
    const promise = Promise.all([
      nStepObservable(
        accountsSubject,
        () => new User({ ...generateUser(1), userName: "custom username" })
      ),
      nStepObservable(
        scriptsSubject,
        () => new Script({ ...generateScript(1), name: "custom script" })
      ),
      nStepObservable(
        savedSearchesSubject,
        () =>
          new SavedSearch({
            ...generateSavedSearch(1),
            name: "custom saved search",
          })
      ),
    ]);

    // Catch associated models
    accountsApi.show.and.callFake(() => accountsSubject);
    scriptsApi.show.and.callFake(() => scriptsSubject);
    savedSearchesApi.show.and.callFake(() => savedSearchesSubject);

    // Update model to contain injector
    if (model) {
      model["injector"] = injector;
    }

    return promise;
  }

  it("should create", () => {
    setup(new AnalysisJob(generateAnalysisJob()));
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should handle error", () => {
    setup(undefined, generateApiErrorDetails());
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  describe("details", () => {
    const model = new AnalysisJob(generateAnalysisJob());

    beforeEach(async function () {
      const promise = setup(model);
      spec.detectChanges();
      await promise;
      spec.detectChanges();
      this.fixture = spec.fixture;
    });

    const details: Detail[] = [
      { label: "Id", key: "id", plain: model.id },
      { label: "Name", key: "name", plain: model.name },
      {
        label: "Annotation Name",
        key: "annotationName",
        plain: model.annotationName,
      },
      {
        label: "Custom Settings",
        key: "customSettings",
        code: model.customSettings,
      },
      { label: "Script", key: "script", model: "Script: custom script (1)" },
      {
        label: "Saved Search",
        key: "savedSearch",
        model: "Saved Search: custom saved search (1)",
      },
      { label: "Started At", key: "startedAt", plain: model.startedAt },
      {
        label: "Overall Status",
        key: "overallStatus",
        plain: model.overallStatus,
      },
      {
        label: "Overall Status Modified At",
        key: "overallStatusModifiedAt",
        plain: model.overallStatusModifiedAt,
      },
      {
        label: "Overall Count",
        key: "overallCount",
        plain: model.overallCount,
      },
      {
        label: "Overall Duration",
        key: "overallDuration",
        plain: model.overallDuration,
      },
      {
        label: "Overall Data Length Bytes",
        key: "overallDataLengthBytes",
        plain: model.overallDataLengthBytes,
      },
    ];

    details.forEach((detail) => assertDetail(detail));
  });
});
