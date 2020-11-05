import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
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

describe("ShallowQuestionsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [ShallowQuestionsService],
    });

    this.service = TestBed.inject(ShallowQuestionsService);
  });

  validateApiList<Question, ShallowQuestionsService>("/questions/");
  validateApiFilter<Question, ShallowQuestionsService>("/questions/filter");
  validateApiShow<Question, ShallowQuestionsService>(
    "/questions/5",
    5,
    new Question(generateQuestion(5))
  );
  validateApiCreate<Question, ShallowQuestionsService>(
    "/questions/",
    new Question(generateQuestion(5))
  );
  validateApiUpdate<Question, ShallowQuestionsService>(
    "/questions/5",
    new Question(generateQuestion(5))
  );
  validateApiDestroy<Question, ShallowQuestionsService>(
    "/questions/5",
    5,
    new Question(generateQuestion(5))
  );
});
