import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, updater } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

export interface IQuestion {
  id?: Id;
  text?: string;
  data?: Blob | any;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

export class Question extends AbstractModel<IQuestion> implements IQuestion {
  public readonly kind = "Question";
  @bawPersistAttr
  public readonly id?: Id;
  @bawPersistAttr
  public readonly text?: string;
  @bawPersistAttr
  public readonly data?: Blob;
  public creatorId?: Id;
  public updaterId?: Id;
  @bawDateTime()
  public createdAt?: DateTimeTimezone;
  @bawDateTime()
  public updatedAt?: DateTimeTimezone;

  // Associations
  @creator<Question>()
  public creator?: User;
  @updater<Question>()
  public updater?: User;

  public get viewUrl(): string {
    throw new Error("Question viewUrl not implemented.");
  }
}
