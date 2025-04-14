import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ACCOUNT, SCRIPT } from "@baw-api/ServiceTokens";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { AnalysisJob } from "@models/AnalysisJob";
import { Script } from "@models/Script";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateScript } from "@test/fakes/Script";
import { generateUser } from "@test/fakes/User";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { nStepObservable } from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import { modelData } from "@test/helpers/faker";
import { AnalysisJobComponent } from "./details.component";

describe("AnalysisJobComponent", () => {
  let injector: AssociationInjector;
  let spec: Spectator<AnalysisJobComponent>;

  const createComponent = createComponentFactory({
    component: AnalysisJobComponent,
    imports: [MockBawApiModule, RouterTestingModule],
  });

  assertPageInfo<AnalysisJob>(AnalysisJobComponent, "Test Analysis Job", {
    analysisJob: {
      model: new AnalysisJob(generateAnalysisJob({ name: "Test Analysis Job" })),
    },
  });

  function setup(model?: AnalysisJob, error?: BawApiError) {
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

    injector = spec.inject(ASSOCIATION_INJECTOR);
    if (model) {
      model["injector"] = injector;
    }

    const accountsApi = spec.inject(ACCOUNT.token);
    const scriptsApi = spec.inject(SCRIPT.token);

    const accountsSubject = new Subject<User>();
    const scriptsSubject = new Subject<Script>();

    const promise = Promise.all([
      nStepObservable(
        accountsSubject,
        () => new User(generateUser({ id: 1, userName: "custom username" }))
      ),
      nStepObservable(
        scriptsSubject,
        () => new Script(generateScript({ id: 1, name: "custom script" }))
      ),
    ]);

    // Catch associated models
    accountsApi.show.and.callFake(() => accountsSubject);
    scriptsApi.show.and.callFake(() => scriptsSubject);

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
    // when asserting the details page, I use an analysis job model with only
    // one associated script and audioEventImport model because the assertDetail()
    // function will not work correctly if there is an array of associated models
    //
    // TODO: This should be fixed correctly by fixing the bugs in assertDetail()
    const model = new AnalysisJob(
      generateAnalysisJob({
        scriptIds: [modelData.id()],
        audioEventImportIds: [modelData.id()],
      })
    );

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
        label: "Scripts",
        key: "script",
        children: [{ model: "Script: custom script (1)" }],
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

