import { DateTimeTimezone, HasCreator, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

export interface IProgressEvent extends HasCreator {
  id?: Id;
  datasetItemId?: Id;
  activity?: string;
}

export class ProgressEvent
  extends AbstractModel<IProgressEvent>
  implements IProgressEvent
{
  public readonly kind = "progress_event";
  public readonly id?: Id;
  public readonly creatorId?: Id;
  @bawPersistAttr()
  public readonly datasetItemId?: Id;
  @bawPersistAttr()
  public readonly activity?: string;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;

  // Associations
  @creator<ProgressEvent>()
  public creator?: User;
  // TODO Add association to DatasetItem

  public get viewUrl(): string {
    throw new Error("ProgressEvent viewUrl not implemented.");
  }
}
