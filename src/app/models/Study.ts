import { Injector } from "@angular/core";
import { DATASET } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id, Param } from "@interfaces/apiInterfaces";
import { modelData } from "@test/helpers/faker";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasOne, Updater } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { Dataset } from "./Dataset";
import type { User } from "./User";

export interface IStudy {
  id?: Id;
  name?: Param;
  creatorId?: Id;
  updaterId?: Id;
  datasetId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

export class Study extends AbstractModel implements IStudy {
  public readonly kind = "Studies";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @BawPersistAttr
  public readonly datasetId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @Creator<Study>()
  public creator?: User;
  @Updater<Study>()
  public updater?: User;
  @HasOne<Study>(DATASET, "datasetId")
  public dataset?: Dataset;

  public static generate(id?: Id): IStudy {
    return {
      id: modelData.id(id),
      name: modelData.param(),
      creatorId: modelData.id(),
      updaterId: modelData.id(),
      datasetId: modelData.id(),
      createdAt: modelData.timestamp(),
      updatedAt: modelData.timestamp(),
    };
  }

  constructor(study: IStudy, injector?: Injector) {
    super(study, injector);
  }

  public get viewUrl(): string {
    throw new Error("Study viewUrl not implemented.");
  }
}
