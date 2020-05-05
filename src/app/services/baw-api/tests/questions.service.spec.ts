import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Question } from "@models/Question";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import { BawApiService } from "../baw-api.service";
import { MockBawApiService } from "../mock/baseApiMock.service";
import { QuestionsService } from "../questions.service";

describe("QuestionsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        QuestionsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(QuestionsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Question, QuestionsService>(
    "/studies/5/questions/",
    undefined,
    5
  );
  validateApiFilter<Question, QuestionsService>(
    "/studies/5/questions/filter",
    undefined,
    undefined,
    5
  );
  validateApiShow<Question, QuestionsService>(
    "/studies/5/questions/10",
    10,
    new Question({ id: 10 }),
    5
  );
  validateApiCreate<Question, QuestionsService>(
    "/studies/5/questions/",
    new Question({ id: 10 }),
    5
  );
  validateApiUpdate<Question, QuestionsService>(
    "/studies/5/questions/10",
    new Question({ id: 10 }),
    5
  );
  validateApiDestroy<Question, QuestionsService>(
    "/studies/5/questions/10",
    10,
    new Question({ id: 10 }),
    5
  );
});
