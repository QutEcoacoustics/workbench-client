import { Injector } from "@angular/core";
import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModelWithoutId } from "@models/AbstractModel";
import { hasOne } from "@models/AssociationDecorators";
import { bawDateTime, bawDuration } from "@models/AttributeDecorators";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { Duration } from "luxon";

export interface IHarvestItemInfoFixes {
  file?: string;
  problems?: {
    [key: string]: {
      data?: null;
      status?: string;
      message?: string;
      severity?: string;
    };
  };
}

export interface IHarvestItemInfoFileInfoNotes {
  relativePath?: string;
}

export interface IHarvestItemInfoValidation {
  name?: string;
  status?: "fixable" | "notFixable";
  message?: string;
}

export interface IHarvestItemInfoFileInfo {
  path?: string;
  notes?: IHarvestItemInfoFileInfoNotes;
  siteId?: Id;
  channels?: number;
  extension?: string;
  fileHash?: string;
  fileName?: string;
  recursive?: boolean;
  mediaType?: string;
  utcOffset?: string;
  accessTime?: DateTimeTimezone | string;
  changeTime?: DateTimeTimezone | string;
  uploaderId?: Id;
  bitRateBps?: number;
  modifiedTime?: DateTimeTimezone | string;
  durationSeconds?: number;
  dataLengthBytes?: number;
  sampleRateHertz?: number;
}

export interface IHarvestItemInfo {
  error?: null;
  fixes?: IHarvestItemInfoFixes[];
  fileInfo?: IHarvestItemInfoFileInfo | HarvestItemInfoFileInfo;
  validations?: IHarvestItemInfoValidation[];
}

export class HarvestItemInfoFileInfo extends AbstractModelWithoutId {
  public readonly kind = "HarvestItemInfoFileInfo";
  public readonly path?: string;
  public readonly notes?: IHarvestItemInfoFileInfoNotes;
  public readonly siteId?: Id;
  public readonly channels?: number;
  public readonly extension?: string;
  public readonly fileHash?: string;
  public readonly fileName?: string;
  public readonly recursive?: boolean;
  public readonly mediaType?: string;
  public readonly utcOffset?: string;
  @bawDateTime()
  public readonly accessTime?: DateTimeTimezone;
  @bawDateTime()
  public readonly changeTime?: DateTimeTimezone;
  public readonly uploaderId?: Id;
  public readonly bitRateBps?: number;
  @bawDateTime()
  public readonly modifiedTime?: DateTimeTimezone;
  public readonly durationSeconds?: number;
  @bawDuration<HarvestItemInfoFileInfo>({ key: "durationSeconds" })
  public duration?: Duration;
  public readonly dataLengthBytes?: number;
  public readonly sampleRateHertz?: number;

  // Associations
  @hasOne<HarvestItemInfoFileInfo, Site>(SHALLOW_SITE, "siteId")
  public site?: Site;
  @hasOne<HarvestItemInfoFileInfo, User>(ACCOUNT, "uploaderId")
  public uploader?: User;

  public constructor(data: IHarvestItemInfoFileInfo, injector?: Injector) {
    super(data, injector);
  }

  public get viewUrl(): string {
    throw new Error("HarvestItemInfoFileInfo does not have a viewUrl");
  }
}

export class HarvestItemInfo extends AbstractModelWithoutId {
  public readonly kind = "HarvestItemInfo";
  public readonly error?: null;
  public readonly fixes?: IHarvestItemInfoFixes[];
  public readonly fileInfo?: HarvestItemInfoFileInfo;
  public readonly validations?: IHarvestItemInfoValidation[];

  public constructor(data: IHarvestItemInfo, injector?: Injector) {
    super(data, injector);
    this.fileInfo = new HarvestItemInfoFileInfo(data.fileInfo, injector);
  }

  public get viewUrl(): string {
    throw new Error("HarvestItemInfo does not have a viewUrl");
  }
}
