import { ACCOUNT, ANALYSIS_JOB, SCRIPT } from "@baw-api/ServiceTokens";
import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { defaultApiPageSize, InnerFilter } from "@baw-api/baw-api.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AnalysisJob } from "@models/AnalysisJob";
import { AssociationInjector } from "@models/ImplementsInjector";
import { Project } from "@models/Project";
import { Script } from "@models/Script";
import { User } from "@models/User";
import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { generateProject } from "@test/fakes/Project";
import { generateScript } from "@test/fakes/Script";
import { generateUser } from "@test/fakes/User";
import { nStepObservable } from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { of, Subject } from "rxjs";
import { AnalysesComponent } from "./list.component";

describe("AnalysesComponent", () => {
  let spec: Spectator<AnalysesComponent>;

  let api: SpyObject<AnalysisJobsService>;
  let defaultModels: AnalysisJob[];

  let injector: SpyObject<AssociationInjector>;

  const createComponent = createRoutingFactory({
    component: AnalysesComponent,
    providers: [provideMockBawApi()],
  });

  beforeEach(async function () {
    const mockProject = new Project(generateProject());

    spec = createComponent({
      detectChanges: false,
      data: {
        project: { model: mockProject },
      },
    });

    injector = spec.inject(ASSOCIATION_INJECTOR);
    api = spec.inject(ANALYSIS_JOB.token);
    const mockScriptsApi = spec.inject(SCRIPT.token);
    const mockAccountsApi = spec.inject(ACCOUNT.token);

    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new AnalysisJob(generateAnalysisJob(), injector));
    }

    const expectedInnerFilters = {
      or: {
        projectId: { eq: mockProject.id },
        systemJob: { eq: true },
      },
    } as const satisfies InnerFilter<AnalysisJob>;

    const scriptsSubject = new Subject<Script>();
    mockScriptsApi.show.and.callFake(() => scriptsSubject);
    await nStepObservable(
      scriptsSubject,
      () => new Script(generateScript(), injector),
    );

    mockAccountsApi.show.and.returnValue(of(new User(generateUser(), injector)));

    this.defaultInnerFilters = expectedInnerFilters;
    this.defaultModels = defaultModels;
    this.fixture = spec.fixture;
    this.api = api;
  });

  assertPagination<AnalysisJob, AnalysisJobsService>();

  assertPageInfo(AnalysesComponent, "Analysis Jobs")

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(AnalysesComponent);
  });

  // TODO Write Tests
  // xdescribe("rows", () => {});
  // xdescribe("actions", () => {});
});

