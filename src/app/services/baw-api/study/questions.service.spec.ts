import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Question } from "@models/Question";
import { Study } from "@models/Study";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateQuestion } from "@test/fakes/Question";
import { validateStandardApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { QuestionsService } from "./questions.service";

type Model = Question;
type Params = [IdOr<Study>];
type Service = QuestionsService;

describe("QuestionsService", (): void => {
  const createModel = () => new Question(generateQuestion({ id: 10 }));
  const baseUrl = "/studies/5/questions/";
  const updateUrl = baseUrl + "10";
  let spec: SpectatorService<QuestionsService>;
  const createService = createServiceFactory({
    service: QuestionsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi<Model, Params, Service>(
    () => spec,
    Question,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    10,
    5
  );
});
