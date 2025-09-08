import { AbstractData } from "@models/AbstractData";
import { AudioEvent } from "@models/AudioEvent";
import { Tag } from "@models/Tag";

export interface ITaggingCorrection {
  audioEvent: AudioEvent;
  incorrectTagId: Tag["id"];
  correctTagId: Tag["id"];
}

export class TaggingCorrection extends AbstractData<ITaggingCorrection> implements ITaggingCorrection {
  public readonly audioEvent: AudioEvent;
  public readonly incorrectTagId: Tag["id"];
  public readonly correctTagId: Tag["id"];
}
