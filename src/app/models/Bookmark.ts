import { Injector } from '@angular/core';
import { AUDIO_RECORDING } from '@baw-api/ServiceTokens';
import {
  DateTimeTimezone,
  Description,
  HasCreatorAndUpdater,
  HasDescription,
  Id,
  Param,
} from '@interfaces/apiInterfaces';
import { AbstractModel } from './AbstractModel';
import { Creator, HasOne, Updater } from './AssociationDecorators';
import { BawDateTime, BawPersistAttr } from './AttributeDecorators';
import type { AudioRecording } from './AudioRecording';
import type { User } from './User';

/**
 * A bookmark model.
 */
export interface IBookmark extends HasCreatorAndUpdater, HasDescription {
  id?: Id;
  audioRecordingId?: Id;
  offsetSeconds?: number;
  name?: Param;
  category?: string;
}

export class Bookmark extends AbstractModel implements IBookmark {
  public readonly kind = 'Bookmark';
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly audioRecordingId?: Id;
  @BawPersistAttr
  public readonly offsetSeconds?: number;
  @BawPersistAttr
  public readonly name?: Param;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @BawPersistAttr
  public readonly category?: string;

  // Associations
  @Creator<Bookmark>()
  public creator?: User;
  @Updater<Bookmark>()
  public updater?: User;
  @HasOne<Bookmark, AudioRecording>(AUDIO_RECORDING, 'audioRecordingId')
  public audioRecording?: AudioRecording;

  constructor(bookmark: IBookmark, injector?: Injector) {
    super(bookmark, injector);
  }

  public listenViewUrl(recordingId: Id, startOffset?: number): string {
    throw new Error('Bookmark listenViewUrl not implemented.');
  }

  public get viewUrl(): string {
    // return `https://www.ecosounds.org/listen/${this.audioRecordingId}?start=${this.offsetSeconds}&end=${???}`;
    console.warn('Bookmark viewUrl not implemented.');
    return '/broken_link';
  }
}
