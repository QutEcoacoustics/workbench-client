import { Id } from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

export interface IAudioEventProvenance {
  id: Id;
  name: string;
  version: string;
  description: string;
  score: number;
}

export class AudioEventProvenance extends AbstractModel implements AudioEventProvenance {
  public readonly id: Id;
  public readonly name: string;
  public readonly version: string;
  public readonly description: string;
  public readonly score: number;

  /**
   * Navigates to the details page of an AudioEventProvenance
   * WARNING: THIS IS NOT CURRENTLY FUNCTIONAL, BUT WE DO USE THIS IN THE CODEBASE AS A STAGING PLACEHOLDER
   */
  public get viewUrl(): string {
    return "";
  }
}
