import {
  Id,
  Param,
  DateTimeTimezone,
  dateTimeTimezone
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

/**
 * An analysis job model.
 */
export interface AnalysisJobInterface {
  id?: Id;
  name?: Param;
  annotationName?: string;
  customSettings?: Blob | any;
  scriptId?: Id;
  creatorId?: Id;
  updaterId?: Id;
  deleterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  deletedAt?: DateTimeTimezone | string;
  description?: Blob | any;
  savedSearchId?: number;
  startedAt?: DateTimeTimezone | string;
  overallStatus?: string;
  overallStatusModifiedAt?: DateTimeTimezone | string;
  overallProgress?: Blob | any;
  overallProgressModifiedAt?: DateTimeTimezone | string;
  overallCount?: number;
  overallDurationSeconds?: number;
  overallDataLengthBytes?: number;
}

export class AnalysisJob extends AbstractModel implements AnalysisJobInterface {
  public readonly kind: "AnalysisJob" = "AnalysisJob";
  public readonly id?: Id;
  public readonly name?: Param;
  public readonly annotationName?: string;
  public readonly customSettings?: Blob;
  public readonly scriptId?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  public readonly createdAt?: DateTimeTimezone | string;
  public readonly updatedAt?: DateTimeTimezone | string;
  public readonly deletedAt?: DateTimeTimezone | string;
  public readonly description?: Blob;
  public readonly savedSearchId?: number;
  public readonly startedAt?: DateTimeTimezone | string;
  public readonly overallStatus?: string;
  public readonly overallStatusModifiedAt?: DateTimeTimezone | string;
  public readonly overallProgress?: Blob;
  public readonly overallProgressModifiedAt?: DateTimeTimezone | string;
  public readonly overallCount?: number;
  public readonly overallDurationSeconds?: number;
  public readonly overallDataLengthBytes?: number;

  constructor(analysisJob: AnalysisJobInterface) {
    super(analysisJob);

    this.customSettings = new Blob([analysisJob.customSettings]);
    this.description = new Blob([analysisJob.description]);
    this.overallProgress = new Blob([analysisJob.overallProgress]);
    this.createdAt = dateTimeTimezone(analysisJob.createdAt as string);
    this.updatedAt = dateTimeTimezone(analysisJob.updatedAt as string);
    this.deletedAt = dateTimeTimezone(analysisJob.deletedAt as string);
    this.startedAt = dateTimeTimezone(analysisJob.startedAt as string);
    this.overallStatusModifiedAt = dateTimeTimezone(
      analysisJob.overallStatusModifiedAt as string
    );
    this.overallProgressModifiedAt = dateTimeTimezone(
      analysisJob.overallProgressModifiedAt as string
    );
  }
}
