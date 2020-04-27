import { ACCOUNT } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  HasOne,
} from "./AbstractModel";
import { User } from "./User";

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
  // TODO Add DatasetItem, Question, and Study associations
  @HasOne(ACCOUNT, (m: Response) => m.creatorId)
  public creator?: Observable<User>;

  constructor(question: IResponse) {
    super(question);
  }

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}
