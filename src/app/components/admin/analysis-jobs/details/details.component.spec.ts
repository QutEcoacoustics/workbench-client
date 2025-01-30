import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ACCOUNT, SAVED_SEARCH, SCRIPT } from "@baw-api/ServiceTokens";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { AnalysisJob } from "@models/AnalysisJob";
import { SavedSearch } from "@models/SavedSearch";
import { Script } from "@models/Script";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateSavedSearch } from "@test/fakes/SavedSearch";
import { generateScript } from "@test/fakes/Script";
import { generateUser } from "@test/fakes/User";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { nStepObservable } from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { PageTitleStrategy } from "src/app/app.component";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import { AdminAnalysisJobComponent } from "./details.component";

describe("AdminAnalysisJobComponent", () => {
  let injector: AssociationInjector;
  let spec: Spectator<AdminAnalysisJobComponent>;
  const createComponent = createComponentFactory({
    component: AdminAnalysisJobComponent,
    imports: [SharedModule, MockBawApiModule, RouterTestingModule],
  });

  assertPageInfo<AnalysisJob>(AdminAnalysisJobComponent, "test name", {
    analysisJob: {
      model: new AnalysisJob(generateAnalysisJob({ name: "test name" })),
    },
  });

  function setup(model: AnalysisJob, error?: BawApiError) {
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
        {
          provide: PageTitleStrategy,
        },
      ],
    });

    injector = spec.inject(ASSOCIATION_INJECTOR);
    const accountsApi = spec.inject(ACCOUNT.token);
    const scriptsApi = spec.inject(SCRIPT.token);
    const savedSearchesApi = spec.inject(SAVED_SEARCH.token);

    const accountsSubject = new Subject<User>();
    const scriptsSubject = new Subject<Script>();
    const savedSearchesSubject = new Subject<SavedSearch>();
    const promise = Promise.all([
      nStepObservable(
        accountsSubject,
        () => new User(generateUser({ id: 1, userName: "custom username" }))
      ),
      nStepObservable(
        scriptsSubject,
        () => new Script(generateScript({ id: 1, name: "custom script" }))
      ),
      nStepObservable(
        savedSearchesSubject,
        () =>
          new SavedSearch(
            generateSavedSearch({ id: 1, name: "custom saved search" })
          )
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
    setup(undefined, generateBawApiError());
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
      { label: "Started At", key: "startedAt", dateTime: model.startedAt },
      {
        label: "Overall Status",
        key: "overallStatus",
        plain: model.overallStatus,
      },
      {
        label: "Overall Status Modified At",
        key: "overallStatusModifiedAt",
        dateTime: model.overallStatusModifiedAt,
      },
      {
        label: "Overall Count",
        key: "overallCount",
        plain: model.overallCount,
      },
      {
        label: "Overall Duration",
        key: "overallDuration",
        duration: model.overallDuration,
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
