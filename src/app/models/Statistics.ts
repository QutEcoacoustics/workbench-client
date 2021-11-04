import { Injector } from "@angular/core";
import { AUDIO_RECORDING, SHALLOW_AUDIO_EVENT } from "@baw-api/ServiceTokens";
import { statisticsMenuItem } from "@components/statistics/statistics.menus";
import { DateTimeTimezone, Id, Ids } from "@interfaces/apiInterfaces";
import { AbstractModelWithoutId } from "@models/AbstractModel";
import { hasMany } from "@models/AssociationDecorators";
import {
  bawCollection,
  bawDateTime,
  bawDuration,
} from "@models/AttributeDecorators";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Duration } from "luxon";

export interface IStatisticsSummary {
  usersOnline: number;
  usersTotal: number;
  onlineWindowStart: DateTimeTimezone | string;
  projectsTotal: number;
  regionsTotal: number;
  sitesTotal: number;
  annotationsTotal: number;
  annotationsTotalDuration: Duration | number;
  annotationsRecent: number;
  audioRecordingsTotal: number;
  audioRecordingsRecent: number;
  audioRecordingsTotalDuration: Duration | number;
  audioRecordingsTotalSize: number;
  tagsTotal: number;
  tagsAppliedTotal: number;
  tagsAppliedUniqueTotal: number;
}

export class StatisticsSummary extends AbstractModelWithoutId {
  public readonly kind = "statistics_summary";
  public readonly usersOnline: number;
  public readonly usersTotal: number;
  @bawDateTime()
  public readonly onlineWindowStart: DateTimeTimezone;
  public readonly projectsTotal: number;
  public readonly regionsTotal: number;
  public readonly sitesTotal: number;
  public readonly annotationsTotal: number;
  @bawDuration()
  public readonly annotationsTotalDuration: Duration;
  public readonly annotationsRecent: number;
  public readonly audioRecordingsTotal: number;
  public readonly audioRecordingsRecent: number;
  @bawDuration()
  public readonly audioRecordingsTotalDuration: Duration;
  public readonly audioRecordingsTotalSize: number;
  public readonly tagsTotal: number;
  public readonly tagsAppliedTotal: number;
  public readonly tagsAppliedUniqueTotal: number;

  public get viewUrl(): string {
    throw Error();
  }

  public override toString(): string {
    return super.toString("No unique information");
  }
}

export interface IStatisticsRecent {
  audioRecordingIds: Ids | Id[];
  audioEventIds: Ids | Id[];
}

export class StatisticsRecent extends AbstractModelWithoutId {
  public readonly kind = "statistics_recent";
  @bawCollection()
  public readonly audioRecordingIds: Ids;
  @bawCollection()
  public readonly audioEventIds: Ids;
  @hasMany<StatisticsRecent, AudioRecording>(
    AUDIO_RECORDING,
    "audioRecordingIds"
  )
  public audioRecordings: AudioRecording[];
  @hasMany<StatisticsRecent, AudioEvent>(SHALLOW_AUDIO_EVENT, "audioEventIds")
  public audioEvents: AudioEvent[];

  public get viewUrl(): string {
    throw Error();
  }

  public override toString(): string {
    return super.toString("No unique information");
  }
}

export interface IStatistics {
  summary: StatisticsSummary | IStatisticsSummary;
  recent: StatisticsRecent | IStatisticsRecent;
}

export class Statistics extends AbstractModelWithoutId {
  public readonly kind = "statistics";
  public readonly summary: StatisticsSummary;
  public readonly recent: StatisticsRecent;

  public constructor(model: IStatistics, injector?: Injector) {
    super(model, injector);
    this.summary = new StatisticsSummary(model.summary, injector);
    this.recent = new StatisticsRecent(model.recent, injector);
  }

  public get viewUrl(): string {
    return statisticsMenuItem.route.toRouterLink();
  }

  public override toString(): string {
    return super.toString("No unique information");
  }
}
