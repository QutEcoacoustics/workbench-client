import { Injector } from "@angular/core";
import { adminScriptMenuItem } from "@component/admin/scripts/scripts.menus";
import { modelData } from "@test/helpers/faker";
import { DateTimeTimezone, Id, Param } from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

/**
 * A script model
 */
export interface IScript {
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
  analysisActionParams?: object;
}

export class Script extends AbstractModel implements IScript {
  public readonly kind = "Script";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly description?: string;
  @BawPersistAttr
  public readonly analysisIdentifier?: string;
  @BawPersistAttr
  public readonly version?: number;
  @BawPersistAttr
  public readonly verified?: boolean;
  public readonly groupId?: Id;
  public readonly creatorId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawPersistAttr
  public readonly executableCommand?: string;
  @BawPersistAttr
  public readonly executableSettings?: string;
  @BawPersistAttr
  public readonly executableSettingsMediaType?: string;
  @BawPersistAttr
  public readonly analysisActionParams?: object;

  // Associations
  // TODO Add Group associations
  @Creator<Script>()
  public creator?: User;

  public static generate(id?: Id): IScript {
    return {
      id: modelData.id(id),
      name: modelData.param(),
      description: modelData.description(),
      analysisIdentifier: "script machine identifier", // TODO Implement with random values
      version: modelData.random.number(50) / 10,
      verified: modelData.boolean(),
      groupId: modelData.id(),
      creatorId: modelData.id(),
      createdAt: modelData.timestamp(),
      executableCommand: "executive command", // TODO Implement with random values
      executableSettings: "executive settings", // TODO Implement with random values
      executableSettingsMediaType: "text/plain", // TODO Implement with random values
      analysisActionParams: {
        fileExecutable: "./AnalysisPrograms/AnalysisPrograms.exe",
        copyPaths: ["./programs/AnalysisPrograms/Logs/log.txt"],
        subFolders: [],
        customSettings: {},
      }, // TODO Implement with random values
    };
  }

  constructor(script: IScript, injector?: Injector) {
    super(script, injector);

    this.executableSettingsMediaType = script.executableSettingsMediaType
      ? script.executableSettingsMediaType
      : "text/plain";
  }

  public get viewUrl(): string {
    return adminScriptMenuItem.route.format({ scriptId: this.id });
  }
}
