import { adminScriptsMenuItem } from "../component/admin/admin.menus";
import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id,
  Param,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

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

    this.createdAt = dateTimeTimezone(script.createdAt as string);
    this.executableSettingsMediaType = script.executableSettingsMediaType
      ? script.executableSettingsMediaType
      : "text/plain";
  }

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
      verified: this.verified,
    };
  }

  navigationPath(): string {
    return adminScriptsMenuItem.route.toString();
  }
}
