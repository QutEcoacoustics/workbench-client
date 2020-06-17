import { Injector } from "@angular/core";
import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { modelData } from "@test/helpers/faker";
import { Duration } from "luxon";
import { DateTimeTimezone, Id, Uuid } from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, Deleter, HasOne, Updater } from "./AssociationDecorators";
import { BawDateTime, BawDuration } from "./AttributeDecorators";
import type { Site } from "./Site";
import type { User } from "./User";

/**
 * An audio recording model
 */
export interface IAudioRecording {
  id?: Id;
  uuid?: Uuid;
  uploaderId?: Id;
  recordedDate?: DateTimeTimezone | string;
  siteId?: Id;
  durationSeconds?: number;
  sampleRateHertz?: number;
  channels?: number;
  bitRateBps?: number;
  mediaType?: string;
  dataLengthBytes?: number;
  fileHash?: string;
  status?: Status;
  notes?: Blob | any;
  creatorId?: Id;
  updaterId?: Id;
  deleterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  deletedAt?: DateTimeTimezone | string;
  originalFileName?: string;
  recordedUtcOffset?: string;
}

/**
 * An audio recording model
 */
export class AudioRecording extends AbstractModel implements IAudioRecording {
  public readonly kind = "AudioRecording";
  public readonly id?: Id;
  public readonly uuid?: Uuid;
  public readonly uploaderId?: Id;
  @BawDateTime()
  public readonly recordedDate?: DateTimeTimezone;
  public readonly siteId?: Id;
  @BawDuration<AudioRecording>({ key: "durationSeconds" })
  public readonly duration: Duration;
  public readonly durationSeconds?: number;
  public readonly sampleRateHertz?: number;
  public readonly channels?: number;
  public readonly bitRateBps?: number;
  public readonly mediaType?: string;
  public readonly dataLengthBytes?: number;
  public readonly fileHash?: string;
  public readonly status?: Status;
  public readonly notes?: Blob;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  public readonly originalFileName?: string;
  public readonly recordedUtcOffset?: string;

  // Associations
  @Creator<AudioRecording>()
  public creator?: User;
  @Updater<AudioRecording>()
  public updater?: User;
  @Deleter<AudioRecording>()
  public deleter?: User;
  @HasOne<AudioRecording>(ACCOUNT, "uploaderId")
  public uploader?: User;
  @HasOne<AudioRecording>(SHALLOW_SITE, "siteId")
  public site?: Site;

  public static generate(id?: Id): IAudioRecording {
    return {
      id: modelData.id(id),
      uuid: modelData.uuid(),
      uploaderId: modelData.id(),
      recordedDate: modelData.timestamp(),
      siteId: modelData.id(),
      durationSeconds: modelData.id(),
      sampleRateHertz: modelData.id(),
      bitRateBps: 22050, // TODO Replace with list of possibilities
      mediaType: "audio/mpeg", // TODO Replace with list of possibilities
      dataLengthBytes: 3800, // TODO Replace with list of possibilities
      fileHash: "SHA: 2346ad27d7568ba9896f1b7da6b5991251debdf2",
      status: modelData.random.arrayElement<Status>([
        "new",
        "uploading",
        "to_check",
        "ready",
        "corrupt",
        "aborted",
      ]),
      notes: modelData.notes(),
      creatorId: modelData.id(),
      updaterId: modelData.id(),
      deleterId: modelData.id(),
      createdAt: modelData.timestamp(),
      updatedAt: modelData.timestamp(),
      deletedAt: modelData.timestamp(),
      originalFileName: modelData.system.fileName(".mpg", "audio"),
      recordedUtcOffset: "+0700", // TODO Replace with list of possibilities
    };
  }

  constructor(audioRecording: IAudioRecording, injector?: Injector) {
    super(audioRecording, injector);
  }

  public get viewUrl(): string {
    console.warn("AudioRecording viewUrl not implement.");
    return "/FIX_ME";
  }
}

type Status =
  | "new"
  | "uploading"
  | "to_check"
  | "ready"
  | "corrupt"
  | "aborted";
