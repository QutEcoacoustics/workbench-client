import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { IQuestion, Question } from "@models/Question";
import { Study } from "@models/Study";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const studyId: IdParam<Study> = id;
const questionId: IdParamOptional<Question> = id;
const endpoint = stringTemplate`/studies/${studyId}/questions/${questionId}${option}`;
const endpointShallow = stringTemplate`/questions/${questionId}${option}`;

@Injectable()
export class QuestionsService extends StandardApi<Question, [IdOr<Study>]> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Question, injector);
  }

  list(study: IdOr<Study>): Observable<Question[]> {
    return this.apiList(endpoint(study, Empty, Empty));
  }
  filter(
    filters: Filters<IQuestion>,
    study: IdOr<Study>
  ): Observable<Question[]> {
    return this.apiFilter(endpoint(study, Empty, Filter), filters);
  }
  show(model: IdOr<Question>, study: IdOr<Study>): Observable<Question> {
    return this.apiShow(endpoint(study, model, Empty));
  }
  create(model: Question, study: IdOr<Study>): Observable<Question> {
    return this.apiCreate(endpoint(study, Empty, Empty), model);
  }
  update(model: Question, study: IdOr<Study>): Observable<Question> {
    return this.apiUpdate(endpoint(study, model, Empty), model);
  }
  destroy(
    model: IdOr<Question>,
    study: IdOr<Study>
  ): Observable<Question | void> {
    return this.apiDestroy(endpoint(study, model, Empty));
  }
}

@Injectable()
export class ShallowQuestionsService extends StandardApi<Question> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Question, injector);
  }

  list(): Observable<Question[]> {
    return this.apiList(endpointShallow(Empty, Empty));
  }
  filter(filters: Filters<IQuestion>): Observable<Question[]> {
    return this.apiFilter(endpointShallow(Empty, Filter), filters);
  }
  show(model: IdOr<Question>): Observable<Question> {
    return this.apiShow(endpointShallow(model, Empty));
  }
  create(model: Question): Observable<Question> {
    return this.apiCreate(endpointShallow(Empty, Empty), model);
  }
  update(model: Question): Observable<Question> {
    return this.apiUpdate(endpointShallow(model, Empty), model);
  }
  destroy(model: IdOr<Question>): Observable<Question | void> {
    return this.apiDestroy(endpointShallow(model, Empty));
  }
}

export const questionResolvers = new Resolvers<Question, QuestionsService>(
  [QuestionsService],
  "questionId",
  ["studyId"]
).create("Question");

export const shallowQuestionResolvers = new Resolvers<
  Question,
  ShallowQuestionsService
>([ShallowQuestionsService], "questionId").create("ShallowQuestion");
