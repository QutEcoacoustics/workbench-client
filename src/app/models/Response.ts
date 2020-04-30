import { Injector } from "@angular/core";
import { DATASET_ITEM, QUESTION, STUDY } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  Creator,
  HasOne,
} from "./AbstractModel";
import type { DatasetItem } from "./DatasetItem";
import type { Question } from "./Question";
import type { Study } from "./Study";
import type { User } from "./User";

export interface IResponse {
  id?: Id;
  data?: Blob;
  datasetItemId?: Id;
  questionId?: Id;
  studyId?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
}

export class Response extends AbstractModel implements IResponse {
  public readonly kind: "Answer" = "Answer";
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
  public readonly createdAt?: DateTimeTimezone | string;

  // Associations
  @Creator<Response>()
  public creator?: Observable<User>;
  @HasOne(DATASET_ITEM, (m: Response) => m.datasetItemId)
  public datasetItem?: Observable<DatasetItem>;
  @HasOne(QUESTION, (m: Response) => m.questionId)
  public question?: Observable<Question>;
  @HasOne(STUDY, (m: Response) => m.studyId)
  public study?: Observable<Study>;

  constructor(question: IResponse, injector?: Injector) {
    super(question, injector);
  }

  public get viewUrl(): string {
    throw new Error("Response viewUrl not implemented.");
  }
}
