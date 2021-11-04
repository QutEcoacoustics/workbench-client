import { SHALLOW_QUESTION, STUDY } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, hasOne } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { Question } from "./Question";
import type { Study } from "./Study";
import type { User } from "./User";

export interface IResponse {
  id?: Id;
  data?: Blob | any;
  datasetItemId?: Id;
  questionId?: Id;
  studyId?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
}

export class Response extends AbstractModel<IResponse> implements IResponse {
  public readonly kind = "response";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly data?: Blob;
  @bawPersistAttr()
  public readonly datasetItemId?: Id;
  @bawPersistAttr()
  public readonly questionId?: Id;
  @bawPersistAttr()
  public readonly studyId?: Id;
  public readonly creatorId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;

  // Associations
  @creator<Response>()
  public creator?: User;
  // TODO Add association to DatasetItem
  @hasOne<Response, Question>(SHALLOW_QUESTION, "questionId")
  public question?: Question;
  @hasOne<Response, Study>(STUDY, "studyId")
  public study?: Study;

  public get viewUrl(): string {
    throw new Error("Response viewUrl not implemented.");
  }
}
