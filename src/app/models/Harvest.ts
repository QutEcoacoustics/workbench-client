import { PROJECT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { harvestRoute } from "@components/harvest/harvest.routes";
import {
  DateTimeTimezone,
  HasCreatorAndUpdater,
  Id,
} from "@interfaces/apiInterfaces";
import { Duration } from "luxon";
import { AbstractModel, AbstractModelWithoutId } from "./AbstractModel";
import { creator, hasOne, updater } from "./AssociationDecorators";
import {
  bawBytes,
  bawDateTime,
  bawDuration,
  bawPersistAttr,
} from "./AttributeDecorators";
import type { Project } from "./Project";
import type { Site } from "./Site";
import type { User } from "./User";
import { AssociationInjector } from "./ImplementsInjector";

/**
 * Status of a harvest
 *
 * Explanation of state transition:
 * https://github.com/QutEcoacoustics/baw-server/wiki/Harvest-Workflows#stages
 *
 * @param new_harvest A new harvest has been created (this will not be seen by the client)
 * @param uploading The user is able to upload files to the harvest
 * @param scanning Scanning the list of uploaded files to find everything
 * @param metadata_extraction Metadata is being extracted from the uploaded files
 * @param metadata_review The user is able to review the extracted metadata to validate everything is correct
 * @param processing The files are being harvested
 * @param complete The harvest is complete
 */
export type HarvestStatus =
  | "newHarvest"
  | "uploading"
  | "scanning"
  | "metadataExtraction"
  | "metadataReview"
  | "processing"
  | "complete";

export interface IHarvestMapping {
  path?: string;
  siteId?: Id;
  utcOffset?: string;
  recursive?: boolean;
}

export class HarvestMapping
  extends AbstractModelWithoutId
  implements IHarvestMapping
{
  public readonly kind = "HarvestMapping";
  @bawPersistAttr()
  public path?: string;
  @bawPersistAttr()
  public siteId?: Id;
  @bawPersistAttr()
  public utcOffset?: string;
  @bawPersistAttr()
  public recursive?: boolean;

  // Associations
  @hasOne<HarvestMapping, Site>(SHALLOW_SITE, "siteId")
  public site?: Site;

  public constructor(data: IHarvestMapping, injector?: AssociationInjector) {
    super(data, injector);
  }

  public get viewUrl(): string {
    throw new Error("HarvestMapping has no viewUrl");
  }
}

export interface IHarvest extends HasCreatorAndUpdater {
  id?: Id;
  name?: string;
  streaming?: boolean;
  status?: HarvestStatus;
  projectId?: Id;
  uploadPassword?: string;
  uploadUser?: string;
  uploadUrl?: string;
  mappings?: IHarvestMapping[] | HarvestMapping[];
  report?: IHarvestReport | HarvestReport;
  lastUploadAt?: DateTimeTimezone | string;
  lastMetadataReviewAt?: DateTimeTimezone | string;
  lastMappingsChangeAt?: DateTimeTimezone | string;
}

export interface HarvestUploadConnectionArguments {
  user: string;
  host: string;
  port: string;
  password: string;
}

export class Harvest extends AbstractModel implements IHarvest {
  public readonly kind = "Harvest";
  public readonly id?: Id;
  @bawPersistAttr()
  public name?: string;
  @bawPersistAttr({ create: true, update: false })
  public readonly streaming?: boolean;
  @bawPersistAttr({ convertCase: true })
  public readonly status?: HarvestStatus;
  public readonly projectId?: Id;
  public readonly creatorId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  public readonly updaterId?: Id;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  public readonly uploadPassword?: string;
  public readonly uploadUser?: string;
  public readonly uploadUrl?: string;
  public readonly uploadHost?: string;
  public readonly uploadPort?: number;
  @bawPersistAttr()
  public mappings?: HarvestMapping[];
  public readonly report?: HarvestReport;
  @bawDateTime()
  public readonly lastUploadAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly lastMetadataReviewAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly lastMappingsChangeAt?: DateTimeTimezone;

  // Associations
  @hasOne<Harvest, Project>(PROJECT, "projectId")
  public project?: Project;
  @creator<Harvest>()
  public creator?: User;
  @updater<Harvest>()
  public updater?: User;

  public constructor(data: IHarvest, injector?: AssociationInjector) {
    super(data, injector);
    this.mappings = ((data.mappings as IHarvestMapping[]) ?? []).map(
      (mapping) => new HarvestMapping(mapping, injector)
    );
    this.report = new HarvestReport(data.report, injector);
    if (this.uploadUrl) {
      const matches = this.uploadUrl.match(/sftp:\/\/([^:]+):([0-9]+)$/)
      this.uploadHost = matches[1];
      this.uploadPort = parseInt(matches[2], 10);
    }
  }

  public get viewUrl(): string {
    return harvestRoute.format({
      projectId: this.projectId,
      harvestId: this.id,
    });
  }

  /** Is true if mappings array has changes which have not been reviewed */
  public get isMappingsDirty(): boolean {
    return this.lastMetadataReviewAt < this.lastMappingsChangeAt;
  }

  public get uploadUrlWithAuth(): string {
    return this.uploadUrl.replace(
      "://",
      `://${this.uploadUser}:${this.uploadPassword}@`
    );
  }

  public get canUpdate(): boolean {
    const notTransitionableStates: HarvestStatus[] = [
      "scanning",
      "metadataExtraction",
      "processing"
    ];

    return !notTransitionableStates.includes(this.status);
  }

  public isAbortable(): boolean {
    return this.canUpdate && this.status !== "complete";
  }
}

export interface IHarvestReport {
  itemsTotal?: number;
  itemsSizeBytes?: number;
  itemsDurationSeconds?: number;
  itemsInvalidFixable?: number;
  itemsInvalidNotFixable?: number;
  itemsNew?: number;
  itemsMetadataGathered?: number;
  itemsFailed?: number;
  itemsCompleted?: number;
  itemsErrored?: number;
  latestActivityAt?: DateTimeTimezone | string;
  runTimeSeconds?: number;
}

export class HarvestReport
  extends AbstractModelWithoutId
  implements IHarvestReport
{
  public readonly kind = "HarvestReport";
  public readonly itemsTotal?: number;
  public readonly itemsSizeBytes?: number;
  @bawBytes<HarvestReport>({ key: "itemsSizeBytes" })
  public readonly itemsSize?: string;
  public readonly itemsDurationSeconds?: number;
  @bawDuration<HarvestReport>({ key: "itemsDurationSeconds" })
  public readonly itemsDuration?: Duration;
  public readonly itemsInvalidFixable?: number;
  public readonly itemsInvalidNotFixable?: number;
  public readonly itemsNew?: number;
  public readonly itemsMetadataGathered?: number;
  public readonly itemsFailed?: number;
  public readonly itemsCompleted?: number;
  public readonly itemsErrored?: number;
  @bawDateTime()
  public readonly latestActivityAt?: DateTimeTimezone;
  public readonly runTimeSeconds?: number;

  public constructor(data: IHarvestReport, injector?: AssociationInjector) {
    super(data, injector);
  }

  public get viewUrl(): string {
    throw new Error("HarvestReport does not have a viewUrl");
  }
}
