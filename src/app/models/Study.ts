import { ACCOUNT, DATASET } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id, Param } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  HasOne,
} from "./AbstractModel";
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
  public readonly kind: "Studies" = "Studies";
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
  @HasOne(DATASET, (m: Study) => m.datasetId)
  public dataset?: Observable<Dataset>;
  @HasOne(ACCOUNT, (m: Study) => m.creatorId)
  public creator?: Observable<User>;
  @HasOne(ACCOUNT, (m: Study) => m.updaterId)
  public updater?: Observable<User>;

  constructor(study: IStudy) {
    super(study);
  }

  public get viewUrl(): string {
    throw new Error("Study viewUrl not implemented.");
  }
}
