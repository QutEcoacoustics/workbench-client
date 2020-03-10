import { Id, Param, DateTimeTimezone } from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { DateTime } from "luxon";

/**
 * A script model
 */
export interface ScriptInterface {
  id?: Id;
  name?: Param;
  description?: string;
  analysisIdentifier?: string;
  version?: number;
  verified?: boolean;
  groupId?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
  executableCommand?: string;
  executableSettings?: string;
  executableSettingsMediaType?: string;
  analysisActionParams?: string;
}

export class Script extends AbstractModel implements ScriptInterface {
  public readonly kind: "Script" = "Script";
  public readonly id?: Id;
  public readonly name?: Param;
  public readonly description?: string;
  public readonly analysisIdentifier?: string;
  public readonly version?: number;
  public readonly verified?: boolean;
  public readonly groupId?: Id;
  public readonly creatorId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly executableCommand?: string;
  public readonly executableSettings?: string;
  public readonly executableSettingsMediaType?: string;
  public readonly analysisActionParams?: string;

  constructor(script: ScriptInterface) {
    super(script);

    if (script.createdAt) {
      this.createdAt = DateTime.fromISO(script.createdAt as string, {
        setZone: true
      });
    }
  }

  static fromJSON = (obj: any) => {
    if (obj === "string") {
      obj = JSON.parse(obj);
    }

    return new Script(obj);
  };

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      analysisIdentifier: this.analysisIdentifier,
      version: this.version,
      executableCommand: this.executableCommand,
      executableSettings: this.executableSettings,
      executableSettingsMediaType: this.executableSettingsMediaType,
      analysisActionParams: this.analysisActionParams,
      verified: this.verified
    };
  }

  redirectPath(): string {
    throw new Error("Not Implemented");
  }
}
