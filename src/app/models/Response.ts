import { Injector } from '@angular/core';
import { SHALLOW_QUESTION, STUDY } from '@baw-api/ServiceTokens';
import { DateTimeTimezone, Id } from '@interfaces/apiInterfaces';
import { AbstractModel } from './AbstractModel';
import { Creator, HasOne } from './AssociationDecorators';
import { BawDateTime, BawPersistAttr } from './AttributeDecorators';
import type { Question } from './Question';
import type { Study } from './Study';
import type { User } from './User';

export interface IResponse {
  id?: Id;
  data?: Blob | any;
  datasetItemId?: Id;
  questionId?: Id;
  studyId?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
}

export class Response extends AbstractModel implements IResponse {
  public readonly kind = 'Answer';
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly data?: Blob;
  @BawPersistAttr
  public readonly datasetItemId?: Id;
  @BawPersistAttr
  public readonly questionId?: Id;
  @BawPersistAttr
  public readonly studyId?: Id;
  public readonly creatorId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;

  // Associations
  @Creator<Response>()
  public creator?: User;
  // TODO Add association to DatasetItem
  @HasOne<Response, Question>(SHALLOW_QUESTION, 'questionId')
  public question?: Question;
  @HasOne<Response, Study>(STUDY, 'studyId')
  public study?: Study;

  constructor(question: IResponse, injector?: Injector) {
    super(question, injector);
  }

  public get viewUrl(): string {
    throw new Error('Response viewUrl not implemented.');
  }
}
