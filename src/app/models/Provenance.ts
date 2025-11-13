import { provenanceMenuItem } from "@components/provenances/provenances.menus";
import { DateTimeTimezone, HasAllUsers, HasDescription, Id } from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import { creator, deleter, updater } from "./AssociationDecorators";
import { User } from "./User";

export interface IProvenance extends HasAllUsers, HasDescription {
  id?: Id;
  name?: string;
  version?: string;
  url?: string;
  description?: string;

  scoreMinimum?: number;
  scoreMaximum?: number;
}

export class Provenance
  extends AbstractModel<IProvenance>
  implements IProvenance
{
  public readonly kind = "Provenance";
  @bawPersistAttr()
  public readonly name: string;
  @bawPersistAttr()
  public readonly version: string;
  @bawPersistAttr()
  public readonly url: string;
  @bawPersistAttr()
  public readonly description: string;
  @bawPersistAttr()
  public readonly scoreMinimum: number;
  @bawPersistAttr()
  public readonly scoreMaximum: number;

  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;

  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;

  @creator()
  public creator?: User;
  @updater()
  public updater?: User;
  @deleter()
  public deleter?: User;

  public get viewUrl(): string {
    return provenanceMenuItem.route.format({
      provenanceId: this.id,
    });
  }

  public override toString(): string {
    return `${this.name} (v.${this.version})`;
  }
}
