import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Question } from "@models/Question";
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
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const studyId: IdParam<Study> = id;
const questionId: IdParamOptional<Question> = id;
const endpoint = stringTemplate`/studies/${studyId}/questions/${questionId}${option}`;
const endpointShallow = stringTemplate`/questions/${questionId}${option}`;

@Injectable()
export class QuestionsService implements StandardApi<Question, [IdOr<Study>]> {
  public constructor(private api: BawApiService<Question>) {}

  public list(study: IdOr<Study>): Observable<Question[]> {
    return this.api.list(Question, endpoint(study, emptyParam, emptyParam));
  }
  public filter(
    filters: Filters<Question>,
    study: IdOr<Study>
  ): Observable<Question[]> {
    return this.api.filter(
      Question,
      endpoint(study, emptyParam, filterParam),
      filters
    );
  }
  public show(model: IdOr<Question>, study: IdOr<Study>): Observable<Question> {
    return this.api.show(Question, endpoint(study, model, emptyParam));
  }
  public create(model: Question, study: IdOr<Study>): Observable<Question> {
    return this.api.create(
      Question,
      endpoint(study, emptyParam, emptyParam),
      (question) => endpoint(study, question, emptyParam),
      model
    );
  }
  public update(model: Question, study: IdOr<Study>): Observable<Question> {
    return this.api.update(Question, endpoint(study, model, emptyParam), model);
  }
  public destroy(
    model: IdOr<Question>,
    study: IdOr<Study>
  ): Observable<Question | void> {
    return this.api.destroy(endpoint(study, model, emptyParam));
  }
}

@Injectable()
export class ShallowQuestionsService implements StandardApi<Question> {
  public constructor(private api: BawApiService<Question>) {}

  public list(): Observable<Question[]> {
    return this.api.list(Question, endpointShallow(emptyParam, emptyParam));
  }
  public filter(filters: Filters<Question>): Observable<Question[]> {
    return this.api.filter(
      Question,
      endpointShallow(emptyParam, filterParam),
      filters
    );
  }
  public show(model: IdOr<Question>): Observable<Question> {
    return this.api.show(Question, endpointShallow(model, emptyParam));
  }
  public create(model: Question): Observable<Question> {
    return this.api.create(
      Question,
      endpointShallow(emptyParam, emptyParam),
      (question) => endpointShallow(question, emptyParam),
      model
    );
  }
  public update(model: Question): Observable<Question> {
    return this.api.update(Question, endpointShallow(model, emptyParam), model);
  }
  public destroy(model: IdOr<Question>): Observable<Question | void> {
    return this.api.destroy(endpointShallow(model, emptyParam));
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
