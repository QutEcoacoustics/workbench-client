import { Id } from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

export interface IAudioEventProvenance {
  id: Id;
  name: string;
  version: string;
  description: string;
  score: number;
  precision: number;
}

export class AudioEventProvenance extends AbstractModel implements AudioEventProvenance {
  public readonly id: Id;
  public readonly name: string;
  public readonly version: string;
  public readonly description: string;
  public readonly score: number;
  public readonly precision: number;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
