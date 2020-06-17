import { Injector } from "@angular/core";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { modelData } from "@test/helpers/faker";
import { AbstractModel } from "./AbstractModel";
import { Creator, Updater } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

export interface IQuestion {
  id?: Id;
  text?: Blob | any;
  data?: Blob | any;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

export class Question extends AbstractModel implements IQuestion {
  public readonly kind = "Question";
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
  public creator?: User;
  @Updater<Question>()
  public updater?: User;

  public static generate(id?: Id): IQuestion {
    return {
      id: modelData.id(id),
      text: modelData.notes(), // TODO This may not be the correct type
      data: modelData.notes(), // TODO This may not be the correct type
      creatorId: modelData.id(),
      updaterId: modelData.id(),
      createdAt: modelData.timestamp(),
      updatedAt: modelData.timestamp(),
    };
  }

  constructor(question: IQuestion, injector?: Injector) {
    super(question, injector);
  }

  public get viewUrl(): string {
    throw new Error("Question viewUrl not implemented.");
  }
}
