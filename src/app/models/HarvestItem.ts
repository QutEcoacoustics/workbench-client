import { ACCOUNT, AUDIO_RECORDING, SHALLOW_HARVEST } from "@baw-api/ServiceTokens";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { bawBytes, bawDateTime, bawDuration, bawReadonlyConvertCase } from "@models/AttributeDecorators";
import { AudioRecording } from "@models/AudioRecording";
import { Duration } from "luxon";
import { AbstractModel, AbstractModelWithoutId } from "./AbstractModel";
import { hasOne } from "./AssociationDecorators";
import { Harvest } from "./Harvest";
import { User } from "./User";
import { AssociationInjector } from "./ImplementsInjector";

/**
 * State of a harvest item
 *
 * @param new File on disk found
 * @param metadataGathered Analyzed the file, gotten the metadata, and validated
 * @param failed File is not valid for some known reason
 * @param completed Successfully harvested the file
 * @param errored An error occurred while harvesting the file
 */
export type HarvestItemState = "new" | "metadataGathered" | "failed" | "completed" | "errored";

export type ValidationFixable = "missingDate" | "ambiguousDateTime" | "futureDate" | "missingUploader" | "noSiteId";

export type ValidationNotFixable =
  | "doesNotExist"
  | "notAFile"
  | "fileEmpty"
  | "invalidExtension"
  | "noDuration"
  | "tooShort"
  | "channelCount"
  | "sampleRate"
  | "bitRate"
  | "mediaType"
  | "duplicateFile"
  | "duplicateFileInHarvest"
  | "notAllowedToUpload"
  | "overlappingFilesInHarvest"
  | "overlappingFiles";

export type ValidationName = ValidationFixable | ValidationNotFixable;

export type ValidationStatus = "fixable" | "notFixable";

export interface IHarvestItemValidation {
  name?: ValidationName;
  status?: ValidationStatus;
  message?: string;
}

export class HarvestItemValidation extends AbstractModelWithoutId implements IHarvestItemValidation {
  @bawReadonlyConvertCase()
  public readonly name?: ValidationName;
  @bawReadonlyConvertCase()
  public readonly status?: "fixable" | "notFixable";
  public readonly message?: string;

  public constructor(data: IHarvestItemValidation, injector?: AssociationInjector) {
    super(data, injector);
  }

  public get viewUrl(): string {
    throw new Error("HarvestItemValidation viewUrl not implemented");
  }
}

export interface IHarvestItem {
  id?: Id;
  harvestId?: Id;
  audioRecordingId?: Id;
  uploaderId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  deleted?: boolean;
  path?: string;
  status?: HarvestItemState;
  validations?: IHarvestItemValidation[] | HarvestItemValidation[];
  report?: IHarvestItemReport | HarvestItemReport;
}

export class HarvestItem extends AbstractModel implements IHarvestItem {
  public readonly kind = "HarvestItem";
  /** Only harvest items for files will have an id */
  public readonly id?: Id;
  public readonly harvestId?: Id;
  public readonly audioRecordingId?: Id;
  public readonly uploaderId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  public readonly deleted?: boolean;
  public readonly path?: string;
  @bawReadonlyConvertCase()
  public readonly status?: HarvestItemState;
  public readonly validations?: HarvestItemValidation[];
  public readonly report?: HarvestItemReport;

  // Associations
  @hasOne<HarvestItem, Harvest>(SHALLOW_HARVEST, "harvestId")
  public harvest: Harvest;
  @hasOne<HarvestItem, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording: AudioRecording;
  @hasOne<HarvestItem, User>(ACCOUNT, "uploaderId")
  public uploader?: User;

  public constructor(data: IHarvestItem, injector?: AssociationInjector) {
    super(data, injector);

    this.report = new HarvestItemReport(data.report, injector);
    if (data.validations) {
      this.validations = (data.validations as IHarvestItemValidation[])?.map(
        (validation) => new HarvestItemValidation(validation, injector),
      );
    }
  }

  public get isDirectory(): boolean {
    return !isInstantiated(this.id);
  }

  public get hasItemsInvalidFixable(): boolean {
    return this.report.itemsInvalidFixable > 0;
  }

  public get hasItemsInvalidNotFixable(): boolean {
    return this.report.itemsInvalidNotFixable > 0;
  }

  public get hasItemsErrored(): boolean {
    return this.report.itemsErrored > 0;
  }

  public get hasItemsInvalid(): boolean {
    return this.hasItemsInvalidFixable || this.hasItemsInvalidNotFixable || this.hasItemsErrored;
  }

  public get viewUrl(): string {
    throw new Error("HarvestItem viewUrl not implemented");
  }
}

export interface IHarvestItemReport {
  itemsTotal?: number;
  itemsSizeBytes?: number;
  itemsDurationSeconds?: number;
  itemsInvalidFixable?: number;
  itemsInvalidNotFixable?: number;
  itemsNew?: number;
  itemsMetadataGathered?: number;
  itemsFailed?: number;
  itemsCompleted?: number;
  itemsErrored?: number;
}

export class HarvestItemReport extends AbstractModelWithoutId implements IHarvestItemReport {
  public readonly kind = "HarvestReport";
  public readonly itemsTotal?: number;
  public readonly itemsSizeBytes?: number;
  @bawBytes<HarvestItemReport>({ key: "itemsSizeBytes" })
  public readonly itemsSize?: string;
  public readonly itemsDurationSeconds?: number;
  @bawDuration<HarvestItemReport>({ key: "itemsDurationSeconds" })
  public readonly itemsDuration?: Duration;
  public readonly itemsInvalidFixable?: number;
  public readonly itemsInvalidNotFixable?: number;
  public readonly itemsNew?: number;
  public readonly itemsMetadataGathered?: number;
  public readonly itemsFailed?: number;
  public readonly itemsCompleted?: number;
  public readonly itemsErrored?: number;

  public constructor(data: IHarvestItemReport, injector?: AssociationInjector) {
    super(data, injector);
  }

  public get viewUrl(): string {
    throw new Error("HarvestItemReport does not have a viewUrl");
  }
}
