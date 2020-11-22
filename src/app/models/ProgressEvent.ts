import { Injector } from '@angular/core';
import { DATASET_ITEM } from '@baw-api/ServiceTokens';
import { DateTimeTimezone, HasCreator, Id } from '@interfaces/apiInterfaces';
import { AbstractModel } from './AbstractModel';
import { Creator, HasOne } from './AssociationDecorators';
import { BawDateTime, BawPersistAttr } from './AttributeDecorators';
import { Dataset } from './Dataset';
import type { DatasetItem } from './DatasetItem';
import type { User } from './User';

export interface IProgressEvent extends HasCreator {
  id?: Id;
  datasetItemId?: Id;
  activity?: string;
}

export class ProgressEvent extends AbstractModel implements IProgressEvent {
  public readonly kind = 'ProgressEvent';
  @BawPersistAttr
  public readonly id?: Id;
  public readonly creatorId?: Id;
  @BawPersistAttr
  public readonly datasetItemId?: Id;
  @BawPersistAttr
  public readonly activity?: string;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;

  // Associations
  @Creator<ProgressEvent>()
  public creator?: User;
  // TODO Add association to DatasetItem

  constructor(progressEvent: IProgressEvent, injector?: Injector) {
    super(progressEvent, injector);
  }

  public get viewUrl(): string {
    throw new Error('ProgressEvent viewUrl not implemented.');
  }
}
