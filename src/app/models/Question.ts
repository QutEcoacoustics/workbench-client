import { Injector } from "@angular/core";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  Creator,
  Updater,
} from "./AbstractModel";
import type { User } from "./User";

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
  @Creator<Question>()
  public creator?: Observable<User>;
  @Updater<Question>()
  public updater?: Observable<User>;

  constructor(question: IQuestion, injector?: Injector) {
    super(question, injector);
  }

  public get viewUrl(): string {
    throw new Error("Question viewUrl not implemented.");
  }
}
