import { Injector } from "@angular/core";
import { AUDIO_RECORDING, SHALLOW_HARVEST } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, HasUpdater, Id } from "@interfaces/apiInterfaces";
import { bawDateTime } from "@models/AttributeDecorators";
import { AudioRecording } from "@models/AudioRecording";
import { AbstractModel } from "../AbstractModel";
import { hasOne, updater } from "../AssociationDecorators";
import { User } from "../User";
import { Harvest } from "./Harvest";
import { HarvestItemInfo, IHarvestItemInfo } from "./HarvestItemInfo";

/**
 * State of a harvest item
 *
 * @param new File on disk found
 * @param metadataGathered Analyzed the file, gotten the metadata, and validated
 * @param failed File is not valid for some known reason
 * @param completed Successfully harvested the file
 * @param errored An error occurred while harvesting the file
 */
export type HarvestItemState =
  | "new"
  | "metadataGathered"
  | "failed"
  | "completed"
  | "errored";

export interface IHarvestItem extends HasUpdater {
  id?: Id;
  harvestId?: Id;
  audioRecordingId?: Id;
  createdAt?: DateTimeTimezone | string;
  deleted?: boolean;
  info?: HarvestItemInfo | IHarvestItemInfo;
  path?: string;
  status?: HarvestItemState;
}

export class HarvestItem extends AbstractModel implements IHarvestItem {
  public readonly kind = "HarvestItem";
  public readonly id?: Id;
  public readonly harvestId?: Id;
  public readonly audioRecordingId?: Id;
  public readonly deleted?: boolean;
  public readonly info?: HarvestItemInfo;
  public readonly path?: string;
  public readonly status?: HarvestItemState;
  @bawDateTime()
  public readonly creatorAt?: DateTimeTimezone;
  public readonly updaterId?: Id;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @hasOne<HarvestItem, Harvest>(SHALLOW_HARVEST, "harvestId")
  public harvest: Harvest;
  @hasOne<HarvestItem, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording: AudioRecording;
  @updater<HarvestItem>()
  public updater?: User;

  public constructor(data: IHarvestItem, injector?: Injector) {
    super(data, injector);
    this.info = new HarvestItemInfo(data.info, injector);
  }

  public get viewUrl(): string {
    throw new Error("HarvestItem viewUrl not implemented");
  }
}
