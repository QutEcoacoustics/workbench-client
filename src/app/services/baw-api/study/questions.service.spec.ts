import { IdOr } from "@baw-api/api-common";
import { Question } from "@models/Question";
import { Study } from "@models/Study";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateQuestion } from "@test/fakes/Question";
import {
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
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
    providers: mockServiceProviders,
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
