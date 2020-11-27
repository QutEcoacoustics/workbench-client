import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { Question } from "@models/Question";
import { Study } from "@models/Study";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateQuestion } from "@test/fakes/Question";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { QuestionsService } from "./questions.service";

type Model = Question;
type Params = [IdOr<Study>];
type Service = QuestionsService;

describe("QuestionsService", function () {
  const createModel = () => new Question(generateQuestion(10));
  const baseUrl = "/studies/5/questions/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [QuestionsService],
    });

    this.service = TestBed.inject(QuestionsService);
  });

  validateApiList<Model, Params, Service>(baseUrl, 5);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter", 5);
  validateApiShow<Model, Params, Service>(baseUrl + "10", 10, createModel, 5);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel, 5);
  validateApiUpdate<Model, Params, Service>(baseUrl + "10", createModel, 5);
  validateApiDestroy<Model, Params, Service>(
    baseUrl + "10",
    10,
    createModel,
    5
  );
});
