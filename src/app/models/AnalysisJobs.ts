import {
  DateTimeTimezone,
  dateTimeTimezone,
  Description,
  Id,
  Param,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Duration } from "luxon";

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
  description?: Description;
  savedSearchId?: Id;
  startedAt?: DateTimeTimezone | string;
  overallStatus?: Status;
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
  public readonly description?: Description;
  public readonly savedSearchId?: Id;
  public readonly startedAt?: DateTimeTimezone | string;
  public readonly overallStatus?: Status;
  public readonly overallStatusModifiedAt?: DateTimeTimezone | string;
  public readonly overallProgress?: Blob;
  public readonly overallProgressModifiedAt?: DateTimeTimezone | string;
  public readonly overallCount?: number;
  public readonly overallDurationSeconds?: number;
  public readonly overallDataLengthBytes?: number;

  public get overallDuration() {
    return new Duration();
    // return duration(this.overallDurationSeconds) // TODO Awaiting PR #177
  }

  constructor(analysisJob: AnalysisJobInterface) {
    super(analysisJob);

    this.customSettings = new Blob([analysisJob.customSettings]);
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

  public toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      annotationName: this.annotationName,
      description: this.description,
    };
  }

  public navigationPath(): string {
    return "/BROKEN_LINK";
  }
}

type Status = "";
