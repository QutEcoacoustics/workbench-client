import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

export interface IAudioEventTag {
  id?: Id;
  audioEventId?: Id;
  tagId?: Id;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

export class AudioEventTag extends AbstractModel implements IAudioEventTag {
  public readonly kind: "AudioEventTag" = "AudioEventTag";
  public readonly id?: Id;
  public readonly audioEventId?: Id;
  public readonly tagId?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;

  constructor(audioEventTag: IAudioEventTag) {
    super(audioEventTag);

    this.createdAt = dateTimeTimezone(audioEventTag.createdAt as string);
    this.updatedAt = dateTimeTimezone(audioEventTag.updatedAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      audioEventId: this.audioEventId,
      tagId: this.tagId,
    };
  }

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}
