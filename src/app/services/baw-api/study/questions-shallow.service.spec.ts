import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Question } from "@models/Question";
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
import { ShallowQuestionsService } from "./questions.service";

type Model = Question;
type Params = [];
type Service = ShallowQuestionsService;

describe("ShallowQuestionsService", function () {
  const createModel = () => new Question(generateQuestion(5));
  const baseUrl = "/questions/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [ShallowQuestionsService],
    });

    this.service = TestBed.inject(ShallowQuestionsService);
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);
});
