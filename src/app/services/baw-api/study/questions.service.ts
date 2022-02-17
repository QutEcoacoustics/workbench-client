import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawApiStateService } from "@baw-api/baw-api-state.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { IQuestion, Question } from "@models/Question";
import { Study } from "@models/Study";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
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
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, Question, injector, state);
  }

  public list(study: IdOr<Study>): Observable<Question[]> {
    return this.apiList(endpoint(study, emptyParam, emptyParam));
  }
  public filter(
    filters: Filters<IQuestion>,
    study: IdOr<Study>
  ): Observable<Question[]> {
    return this.apiFilter(endpoint(study, emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Question>, study: IdOr<Study>): Observable<Question> {
    return this.apiShow(endpoint(study, model, emptyParam));
  }
  public create(model: Question, study: IdOr<Study>): Observable<Question> {
    return this.apiCreate(
      endpoint(study, emptyParam, emptyParam),
      (question) => endpoint(study, question, emptyParam),
      model
    );
  }
  public update(model: Question, study: IdOr<Study>): Observable<Question> {
    return this.apiUpdate(endpoint(study, model, emptyParam), model);
  }
  public destroy(
    model: IdOr<Question>,
    study: IdOr<Study>
  ): Observable<Question | void> {
    return this.apiDestroy(endpoint(study, model, emptyParam));
  }
}

@Injectable()
export class ShallowQuestionsService extends StandardApi<Question> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, Question, injector, state);
  }

  public list(): Observable<Question[]> {
    return this.apiList(endpointShallow(emptyParam, emptyParam));
  }
  public filter(filters: Filters<IQuestion>): Observable<Question[]> {
    return this.apiFilter(endpointShallow(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Question>): Observable<Question> {
    return this.apiShow(endpointShallow(model, emptyParam));
  }
  public create(model: Question): Observable<Question> {
    return this.apiCreate(
      endpointShallow(emptyParam, emptyParam),
      (question) => endpointShallow(question, emptyParam),
      model
    );
  }
  public update(model: Question): Observable<Question> {
    return this.apiUpdate(endpointShallow(model, emptyParam), model);
  }
  public destroy(model: IdOr<Question>): Observable<Question | void> {
    return this.apiDestroy(endpointShallow(model, emptyParam));
  }
}

export const questionResolvers = new Resolvers<Question, [IdOr<Study>]>(
  [QuestionsService],
  "questionId",
  ["studyId"]
).create("Question");

export const shallowQuestionResolvers = new Resolvers<Question, []>(
  [ShallowQuestionsService],
  "questionId"
).create("ShallowQuestion");
