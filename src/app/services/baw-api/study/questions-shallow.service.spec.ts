import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Question } from "@models/Question";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
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
  const createModel = () => new Question(generateQuestion({ id: 5 }));
  const baseUrl = "/questions/";
  const createService = createServiceFactory({
    service: ShallowQuestionsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);
});
