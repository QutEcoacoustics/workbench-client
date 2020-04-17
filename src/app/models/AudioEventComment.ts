import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

export interface IAudioEventComment {
  id?: Id;
  audioEventId?: Id;
  comment?: Blob;
  flag?: Flag;
  flagExplain?: Blob;
  flaggerId?: Id;
  creatorId?: Id;
  updaterId?: Id;
  deleterId?: Id;
  flaggedAt?: DateTimeTimezone | string;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  deletedAt?: DateTimeTimezone | string;
}

export class AudioEventComment extends AbstractModel
  implements IAudioEventComment {
  public readonly kind: "AudioEventComment" = "AudioEventComment";
  public readonly id?: Id;
  public readonly audioEventId?: Id;
  public readonly comment?: Blob;
  public readonly flag?: Flag;
  public readonly flagExplain?: Blob;
  public readonly flaggerId?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  public readonly flaggedAt?: DateTimeTimezone;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;
  public readonly deletedAt?: DateTimeTimezone;

  constructor(audioEventComment: IAudioEventComment) {
    super(audioEventComment);

    this.flaggedAt = dateTimeTimezone(audioEventComment.flaggedAt as string);
    this.createdAt = dateTimeTimezone(audioEventComment.createdAt as string);
    this.updatedAt = dateTimeTimezone(audioEventComment.updatedAt as string);
    this.deletedAt = dateTimeTimezone(audioEventComment.deletedAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      audioEventId: this.audioEventId,
      comment: this.comment,
      flag: this.flag,
      flagExplain: this.flagExplain,
    };
  }

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}

type Flag = "??? Anthony";
