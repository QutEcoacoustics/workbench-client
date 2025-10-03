import { HasAllUsers, HasDescription, Id } from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { bawPersistAttr } from "./AttributeDecorators";

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

  /**
   * Navigates to the details page of an AudioEventProvenance
   */
  public get viewUrl(): string {
    return `/provenances/${this.id}`;
  }

  public override toString(): string {
    return `${this.name} (v.${this.version})`;
  }
}
