import { Id } from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { bawPersistAttr } from "./AttributeDecorators";

export interface IAudioEventProvenance {
  id: Id;
  name: string;
  version: string;
  description: string;
  score: number;
}

export class AudioEventProvenance extends AbstractModel<IAudioEventProvenance> implements IAudioEventProvenance {
  @bawPersistAttr()
  public readonly id: Id;
  @bawPersistAttr()
  public readonly name: string;
  @bawPersistAttr()
  public readonly version: string;
  @bawPersistAttr()
  public readonly description: string;
  @bawPersistAttr()
  public readonly score: number;

  /**
   * Navigates to the details page of an AudioEventProvenance
   * WARNING: THIS IS NOT CURRENTLY FUNCTIONAL, BUT WE DO USE THIS IN THE CODEBASE AS A STAGING PLACEHOLDER
   */
  public get viewUrl(): string {
    console.warn("AudioEventProvenance.viewUrl is not implemented");
    return "";
  }

  public override toString(): string {
    return `${this.name} (version ${this.version})`;
  }
}
