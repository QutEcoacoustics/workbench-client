import { Injector } from '@angular/core';
import {
  DateTimeTimezone,
  HasCreatorAndUpdater,
  Id,
} from '../interfaces/apiInterfaces';
import { AbstractData } from './AbstractData';
import { AbstractModel } from './AbstractModel';
import { Creator, Updater } from './AssociationDecorators';
import { BawDateTime, BawPersistAttr } from './AttributeDecorators';
import type { User } from './User';

/**
 * Tag model interface
 */
export interface ITag extends HasCreatorAndUpdater {
  id?: Id;
  text?: string;
  isTaxonomic?: boolean;
  typeOfTag?: string;
  retired?: boolean;
  notes?: Blob | object;
}

/**
 * Tag model
 */
export class Tag extends AbstractModel implements ITag {
  public readonly kind = 'Tag';
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly text?: string;
  @BawPersistAttr
  public readonly isTaxonomic?: boolean;
  @BawPersistAttr
  public readonly typeOfTag?: string;
  @BawPersistAttr
  public readonly retired?: boolean;
  @BawPersistAttr
  public readonly notes?: Blob;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @Creator<Tag>()
  public creator?: User;
  @Updater<Tag>()
  public updater?: User;

  constructor(tag: ITag, injector?: Injector) {
    super(tag, injector);
  }

  public get viewUrl(): string {
    console.warn('Tag viewUrl method not implemented');
    return '/broken_link';
  }

  public toString(): string {
    return this.text;
  }
}

export class TagType extends AbstractData {
  public readonly kind = 'TagType';
  public readonly name: string;

  constructor(data: { name: string }) {
    super(data);
  }
}
