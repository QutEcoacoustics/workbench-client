import { AUDIO_EVENT_PROVENANCE, TAG } from "@baw-api/ServiceTokens";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { hasOne } from "@models/AssociationDecorators";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { Tag } from "@models/Tag";
import { IEventScore } from "./EventScore";

export interface IEventGroup {
  provenanceId: Id;
  tagId: Id;
  detections: number;
  bucketsWithDetections: number;
  score: IEventScore;
}

export class EventGroup
  extends AbstractModel<IEventGroup>
  implements IEventGroup
{
  public provenanceId: Id;
  public tagId: Id;
  public detections: number;
  public bucketsWithDetections: number;
  public score: IEventScore;

  // associations
  @hasOne<EventGroup, AudioEventProvenance>(AUDIO_EVENT_PROVENANCE, "provenanceId")
  public provenance?: AudioEventProvenance;
  @hasOne<EventGroup, Tag>(TAG, "tagId")
  public tag?: Tag;

  public get viewUrl(): string {
    return "";
  }
}
