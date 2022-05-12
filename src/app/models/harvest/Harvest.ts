import { Injector } from "@angular/core";
import { projectHarvestRoute } from "@components/projects/projects.routes";
import {
  DateTimeTimezone,
  HasCreatorAndUpdater,
  Id,
} from "@interfaces/apiInterfaces";
import { AbstractModelWithoutId } from "../AbstractModel";

/**
 * Status of a harvest
 *
 * State transition map:
 * ```
 *                     |-------------------------------(streaming only)-------------------|
 *                     ↑                                                                  ↓
 * :new_harvest → :uploading → :metadata_extraction → :metadata_review → :processing → :complete
 *                     ↑                ↑                      ↓
 *                     |----------(batch upload only)----------|
 *```
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
  | "metadataExtraction"
  | "metadataReview"
  | "processing"
  | "complete";

export interface IHarvestStatus {
  new: number;
  metadataGathered: number;
  failed: number;
  completed: number;
  errored: number;
}

export interface IHarvestReportInvalidItems {
  fixable: number;
  notFixable: number;
}

export interface IHarvestReport {
  itemsCount: number;
  itemsSize: number;
  itemsDuration: number;
  itemsStatuses: IHarvestStatus;
  invalidItems: IHarvestReportInvalidItems;
  latestActivity: DateTimeTimezone | string;
  runTime: number;
}

export interface IHarvestMapping {
  path: string;
  siteId: Id;
  utcOffset: string;
  recursive: boolean;
}

export interface IHarvest extends HasCreatorAndUpdater {
  id: Id;
  streaming: boolean;
  status: HarvestStatus;
  projectId: Id;
  uploadPassword: string;
  uploadUser: string;
  uploadUrl: string;
  mappings: IHarvestMapping[];
  report: IHarvestReport;
}

export class Harvest extends AbstractModelWithoutId implements IHarvest {
  public readonly kind = "Harvest";
  public readonly id: Id;
  public readonly streaming: boolean;
  public readonly status: HarvestStatus;
  public readonly projectId: Id;
  public readonly uploadPassword: string;
  public readonly uploadUser: string;
  public readonly uploadUrl: string;
  public readonly mappings: IHarvestMapping[];
  public readonly report: IHarvestReport;

  public constructor(data: IHarvest, injector?: Injector) {
    super(data, injector);
  }

  public get viewUrl(): string {
    return projectHarvestRoute.format({ projectId: this.projectId });
  }
}
