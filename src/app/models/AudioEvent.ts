import { Injector } from '@angular/core';
import { AUDIO_RECORDING, TAG } from '@baw-api/ServiceTokens';
import { libraryMenuItem, listenMenuItem } from '@helpers/page/externalMenus';
import {
  DateTimeTimezone,
  HasAllUsers,
  Id,
  Ids,
} from '@interfaces/apiInterfaces';
import { AbstractModel } from './AbstractModel';
import {
  Creator,
  Deleter,
  HasMany,
  HasOne,
  Updater,
} from './AssociationDecorators';
import { BawDateTime, BawPersistAttr } from './AttributeDecorators';
import type { AudioRecording } from './AudioRecording';
import type { Tag } from './Tag';
import { ITagging, Tagging } from './Tagging';
import type { User } from './User';

export interface IAudioEvent extends HasAllUsers {
  id?: Id;
  audioRecordingId?: Id;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  lowFrequencyHertz?: number;
  highFrequencyHertz?: number;
  isReference?: boolean;
  taggings?: ITagging[] | Tagging[];
}

export class AudioEvent extends AbstractModel implements IAudioEvent {
  public readonly kind = 'AudioEvent';
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly audioRecordingId?: Id;
  @BawPersistAttr
  public readonly startTimeSeconds?: number;
  @BawPersistAttr
  public readonly endTimeSeconds?: number;
  @BawPersistAttr
  public readonly lowFrequencyHertz?: number;
  @BawPersistAttr
  public readonly highFrequencyHertz?: number;
  @BawPersistAttr
  public readonly isReference?: boolean;
  public readonly taggings?: Tagging[];
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;

  // Associations
  @Creator<AudioEvent>()
  public creator?: User;
  @Updater<AudioEvent>()
  public updater?: User;
  @Deleter<AudioEvent>()
  public deleter?: User;
  @HasOne<AudioEvent, AudioRecording>(AUDIO_RECORDING, 'audioRecordingId')
  public audioRecording?: AudioRecording;
  @HasMany<AudioEvent, Tag>(TAG, 'tagIds')
  public tags?: Tag[];

  constructor(audioEvent: IAudioEvent, injector?: Injector) {
    super(audioEvent, injector);
    this.taggings = ((audioEvent.taggings ?? []) as ITagging[]).map(
      (tagging) => new Tagging(tagging, injector)
    );
  }

  public get viewUrl(): string {
    return libraryMenuItem.uri([]);
  }

  public get listenViewUrl(): string {
    return listenMenuItem.uri([]);
  }

  public get tagIds(): Ids {
    return new Set((this.taggings ?? []).map((tagging) => tagging.tagId));
  }
}
