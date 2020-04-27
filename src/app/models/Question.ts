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

export interface IQuestion {
  id?: Id;
  text?: Blob;
  data?: Blob;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

export class Question extends AbstractModel implements IQuestion {
  public readonly kind: "Question" = "Question";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly text?: Blob;
  @BawPersistAttr
  public readonly data?: Blob;
  creatorId?: Id;
  updaterId?: Id;
  @BawDateTime()
  createdAt?: DateTimeTimezone;
  @BawDateTime()
  updatedAt?: DateTimeTimezone;

  // Associations
  @HasOne(ACCOUNT, (m: Question) => m.creatorId)
  public creator?: Observable<User>;
  @HasOne(ACCOUNT, (m: Question) => m.updaterId)
  public updater?: Observable<User>;

  constructor(question: IQuestion) {
    super(question);
  }

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}
