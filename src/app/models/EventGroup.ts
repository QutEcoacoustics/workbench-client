import { Id } from "@interfaces/apiInterfaces";
import { AUDIO_EVENT_PROVENANCE, TAG } from "@baw-api/ServiceTokens";
import { AbstractModel } from "./AbstractModel";
import { IEventScore, IReportEvent } from "./EventSummaryReport";
import { hasOne } from "./AssociationDecorators";
import { AudioEventProvenance } from "./AudioEventProvenance";
import { Tag } from "./Tag";

export interface IEventGroup {
  provenanceId: Id;
  tagId: Id;
  detections: number;
  bucketsWithDetections: number;
  score: IEventScore;
  bucketsWithInterference?: IReportEvent[];
}

export class EventGroup
  extends AbstractModel<IEventGroup>
  implements IEventGroup
{
  public provenanceId: number;
  public tagId: number;
  public detections: number;
  public bucketsWithDetections: number;
  public score: IEventScore;
  public bucketsWithInterference?: IReportEvent[];

  // associations
  @hasOne<EventGroup, AudioEventProvenance>(AUDIO_EVENT_PROVENANCE, "provenanceId")
  public provenance?: AudioEventProvenance;
  @hasOne<EventGroup, Tag>(TAG, "tagId")
  public tag?: Tag;

  public get viewUrl(): string {
    return "";
  }
}
