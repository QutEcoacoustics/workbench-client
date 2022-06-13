import { Injector } from "@angular/core";
import { projectHarvestRoute } from "@components/projects/projects.routes";
import {
  DateTimeTimezone,
  HasCreatorAndUpdater,
  Id,
} from "@interfaces/apiInterfaces";
import { Duration } from "luxon";
import { AbstractModel, AbstractModelWithoutId } from "./AbstractModel";
import { creator, updater } from "./AssociationDecorators";
import {
  bawDateTime,
  bawDuration,
  bawPersistAttr,
} from "./AttributeDecorators";
import { User } from "./User";

/**
 * Status of a harvest
 *
 * Explanation of state transition:
 * https://github.com/QutEcoacoustics/baw-server/wiki/Harvest-Workflows#stages
 *
 * @param newHarvest A new harvest has been created (this will not be seen by the client)
 * @param uploading The user is able to upload files to the harvest
 * @param metadataExtraction Metadata is being extracted from the uploaded files
 * @param metadataReview The user is able to review the extracted metadata to validate everything is correct
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
  | "review"
  | "complete";

export interface IHarvestMapping {
  path?: string;
  siteId?: Id;
  utcOffset?: string;
  recursive?: boolean;
}

export interface IHarvest extends HasCreatorAndUpdater {
  id?: Id;
  streaming?: boolean;
  status?: HarvestStatus;
  projectId?: Id;
  uploadPassword?: string;
  uploadUser?: string;
  uploadUrl?: string;
  mappings?: IHarvestMapping[];
  report?: IHarvestReport | HarvestReport;
  lastMetadataReviewAt?: DateTimeTimezone | string;
  lastMappingUpdateAt?: DateTimeTimezone | string;
}

export class Harvest extends AbstractModel implements IHarvest {
  public readonly kind = "Harvest";
  public readonly id?: Id;
  @bawPersistAttr({ create: true, update: false })
  public readonly streaming?: boolean;
  @bawPersistAttr()
  public readonly status?: HarvestStatus;
  public readonly projectId?: Id;
  public readonly creatorId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updaterId?: Id;
  public readonly updatedAt?: DateTimeTimezone;
  public readonly uploadPassword?: string;
  public readonly uploadUser?: string;
  public readonly uploadUrl?: string;
  @bawPersistAttr()
  public mappings?: IHarvestMapping[];
  public readonly report?: HarvestReport;
  @bawDateTime()
  public readonly lastMetadataReviewAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly lastMappingUpdateAt?: DateTimeTimezone;

  // Associations
  @creator<Harvest>()
  public creator?: User;
  @updater<Harvest>()
  public updater?: User;

  public constructor(data: IHarvest, injector?: Injector) {
    super(data, injector);
    this.report = new HarvestReport(data.report, injector);
  }

  public get viewUrl(): string {
    return projectHarvestRoute.format({ projectId: this.projectId });
  }

  /** Is true if mappings array has changes which have not been reviewed */
  public get isMappingsDirty(): boolean {
    return this.lastMetadataReviewAt < this.lastMappingUpdateAt;
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

  public constructor(data: IHarvestReport, injector?: Injector) {
    super(data, injector);
  }

  public get viewUrl(): string {
    throw new Error("HarvestReport does not have a viewUrl");
  }
}
