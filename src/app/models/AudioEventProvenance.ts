import { provenanceMenuItem } from "@components/provenances/provenances.menus";
import { DateTimeTimezone, HasAllUsers, HasDescription, Id } from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";

export interface IAudioEventProvenance extends HasAllUsers, HasDescription {
  id?: Id;
  name?: string;
  version?: string;
  description?: string;

  scoreMinimum?: number;
  scoreMaximum?: number;
}

export class AudioEventProvenance
  extends AbstractModel<IAudioEventProvenance>
  implements IAudioEventProvenance
{
  @bawPersistAttr()
  public readonly id: Id;
  @bawPersistAttr()
  public readonly name: string;
  @bawPersistAttr()
  public readonly version: string;
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

  /**
   * Navigates to the details page of an AudioEventProvenance
   */
  public get viewUrl(): string {
    return provenanceMenuItem.route.format({
      provenanceId: this.id,
    });
  }

  public override toString(): string {
    return `${this.name} (v.${this.version})`;
  }
}
