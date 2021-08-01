import { Injector } from "@angular/core";
import { AUDIO_RECORDING, SHALLOW_AUDIO_EVENT } from "@baw-api/ServiceTokens";
import { statisticsMenuItem } from "@components/statistics/statistics.menus";
import { DateTimeTimezone, Id, Ids } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { hasMany } from "@models/AssociationDecorators";
import { bawDateTime, bawDuration } from "@models/AttributeDecorators";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Duration } from "luxon";

export interface IStatisticsSummary {
  usersOnline: number;
  usersTotal: number;
  onlineWindowStart: DateTimeTimezone | string;
  annotationsTotal: number;
  annotationsTotalDuration: Duration | number;
  annotationsRecent: number;
  audioRecordingTotal: number;
  audioRecordingRecent: number;
  audioRecordingTotalDuration: number;
  audioRecordingTotalSize: number;
  tagsTotal: number;
  tagsAppliedTotal: number;
}

export class StatisticsSummary extends AbstractModel {
  public readonly kind = "StatisticsSummary";
  public readonly usersOnline: number;
  public readonly usersTotal: number;
  @bawDateTime()
  public readonly onlineWindowStart: DateTimeTimezone;
  public readonly annotationsTotal: number;
  @bawDuration()
  public readonly annotationsTotalDuration: Duration;
  public readonly annotationsRecent: number;
  public readonly audioRecordingTotal: number;
  public readonly audioRecordingRecent: number;
  public readonly audioRecordingTotalDuration: number;
  public readonly audioRecordingTotalSize: number;
  public readonly tagsTotal: number;
  public readonly tagsAppliedTotal: number;

  public get viewUrl(): string {
    throw Error();
  }
}

export interface IStatisticsRecent {
  audioRecordings: Ids | Id[];
  audioEvents: Ids | Id[];
}

export class StatisticsRecent extends AbstractModel {
  public readonly kind = "StatisticsRecent";
  public readonly audioRecordings: Ids | Id[];
  public readonly audioEvents: Ids | Id[];
  @hasMany<StatisticsRecent, AudioRecording>(AUDIO_RECORDING, "audioRecordings")
  public audioRecordingModels: AudioRecording[];
  @hasMany<StatisticsRecent, AudioEvent>(SHALLOW_AUDIO_EVENT, "audioEvents")
  public audioEventModels: AudioEvent[];

  public get viewUrl(): string {
    throw Error();
  }
}

export interface IStatistics {
  summary: StatisticsSummary | IStatisticsSummary;
  recent: StatisticsRecent | IStatisticsRecent;
}

export class Statistics extends AbstractModel {
  public readonly kind = "Statistics";
  public readonly summary: StatisticsSummary;
  public readonly recent: StatisticsRecent;

  public constructor(model: IStatistics, protected injector?: Injector) {
    super(model, injector);
    this.summary = new StatisticsSummary(model.summary, injector);
    this.recent = new StatisticsRecent(model.recent, injector);
  }

  public get viewUrl(): string {
    return statisticsMenuItem.route.toRouterLink();
  }
}
