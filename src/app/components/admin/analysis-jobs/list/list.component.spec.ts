import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
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
import { AdminAnalysisJobsComponent } from "./list.component";

describe("AnalysisJobComponent", () => {
  let spec: Spectator<AdminAnalysisJobsComponent>;

  let api: SpyObject<AnalysisJobsService>;
  let defaultModels: AnalysisJob[];

  let injector: SpyObject<AssociationInjector>;

  const createComponent = createRoutingFactory({
    component: AdminAnalysisJobsComponent,
    providers: [provideMockBawApi(0)],
  });

  beforeEach(function () {
    spec = createComponent({ detectChanges: false });

    injector = spec.inject(ASSOCIATION_INJECTOR);
    api = spec.inject(ANALYSIS_JOB.token);
    const mockScriptsApi = spec.inject(SCRIPT.token);
    const mockAccountsApi = spec.inject(ACCOUNT.token);

    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new AnalysisJob(generateAnalysisJob(), injector));
    }

    mockScriptsApi.show.and.returnValue(() => of(new Script(generateScript(), injector)));
    mockAccountsApi.show.and.callFake(() => of(new User(generateUser(), injector)));

    this.defaultModels = defaultModels;
    this.fixture = spec.fixture;
    this.api = api;
  });

  assertPagination<AnalysisJob, AnalysisJobsService>();

  assertPageInfo(AdminAnalysisJobsComponent, "Analysis Jobs")

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(AdminAnalysisJobsComponent);
  });

  // TODO Write Tests
  // xdescribe("rows", () => {});
  // xdescribe("actions", () => {});
});
