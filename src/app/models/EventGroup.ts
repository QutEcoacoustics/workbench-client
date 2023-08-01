import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { IEventScore, IReportEvent } from "./EventSummaryReport";

export interface IEventGroup {
  provenanceId: Id;
  tagId: Id;
  detections: number;
  bucketsWithDetections: number;
  score: IEventScore;
  bucketsWithInterference?: IReportEvent[];
}

export class EventGroup extends AbstractModel implements IEventGroup {
  public provenanceId: number;
  public tagId: number;
  public detections: number;
  public bucketsWithDetections: number;
  public score: IEventScore;
  public bucketsWithInterference?: IReportEvent[];

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
