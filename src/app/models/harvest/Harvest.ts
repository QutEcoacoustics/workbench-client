import { Injector } from "@angular/core";
import { projectHarvestRoute } from "@components/projects/projects.routes";
import { HasCreatorAndUpdater, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "../AbstractModel";
import { HarvestReport, IHarvestReport } from "./HarvestReport";

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
}

export class Harvest extends AbstractModel implements IHarvest {
  public readonly kind = "Harvest";
  public readonly id?: Id;
  public readonly streaming?: boolean;
  public readonly status?: HarvestStatus;
  public readonly projectId?: Id;
  public readonly uploadPassword?: string;
  public readonly uploadUser?: string;
  public readonly uploadUrl?: string;
  public readonly mappings?: IHarvestMapping[];
  public readonly report?: HarvestReport;

  public constructor(data: IHarvest, injector?: Injector) {
    super(data, injector);
    this.report = new HarvestReport(data.report, injector);
  }

  public get viewUrl(): string {
    return projectHarvestRoute.format({ projectId: this.projectId });
  }
}
