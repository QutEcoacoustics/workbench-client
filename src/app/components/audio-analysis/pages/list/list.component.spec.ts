import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { defaultApiPageSize, InnerFilter } from "@baw-api/baw-api.service";
import { AnalysisJob } from "@models/AnalysisJob";
import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { ACCOUNT, ANALYSIS_JOB, SCRIPT } from "@baw-api/ServiceTokens";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import { of } from "rxjs";
import { Script } from "@models/Script";
import { generateScript } from "@test/fakes/Script";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
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

  beforeEach(function () {
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

    mockScriptsApi.show.and.returnValue(() => of(new Script(generateScript(), injector)));
    mockAccountsApi.show.and.callFake(() => of(new User(generateUser(), injector)));

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

