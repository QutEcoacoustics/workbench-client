import { Histogram, IHistogram, Range } from "@baw-api/baw-api.service";
import { AUDIO_EVENT_PROVENANCE, SITE, TAG } from "@baw-api/ServiceTokens";
import { DateTime } from "luxon";
import { AbstractModelWithoutId } from "./AbstractModel";
import type { AnalysisJobItemResultStatus } from "./AnalysisJobItem";
import { hasOne } from "./AssociationDecorators";
import { bawDateTimeRange } from "./AttributeDecorators";
import { AssociationInjector } from "./ImplementsInjector";
import type { Provenance } from "./Provenance";
import type { Site } from "./Site";
import type { Tag } from "./Tag";

export type SupportedTagBucketSize = "day" | "week" | "month" | "year";
export type SupportedDielBucketSize = "minute" | "half-hour" | "hour";

export class TagEventCount extends AbstractModelWithoutId {
  public readonly kind: string = "TagEventCount";

  public readonly tagId!: number;

  public readonly events!: number;

  @hasOne(TAG, "tagId")
  public readonly tag?: Tag;

  public get viewUrl(): string {
    throw new Error("TagEventCount does not have a viewUrl");
  }
}

export class TagAccumulationItem extends AbstractModelWithoutId {
  public readonly kind: string = "TagAccumulationItem";

  @bawDateTimeRange()
  public readonly range!: Range<DateTime>;

  public readonly cumulativeUniqueTagCount!: number;

  public get viewUrl(): string {
    throw new Error("TagAccumulationItem does not have a viewUrl");
  }
}

export class TagFrequencyReportItem extends AbstractModelWithoutId {
  public readonly kind: string = "TagFrequencyReportItem";

  @bawDateTimeRange()
  public readonly range!: Range<DateTime>;

  public readonly tags!: TagEventCount[];

  public constructor(
    data: { range: Range<DateTime>; tags: { tagId: number; events: number }[] },
    injector?: AssociationInjector,
  ) {
    super(data, injector);
    this.tags = data.tags.map((tag) => new TagEventCount(tag, injector));
  }

  public get viewUrl(): string {
    throw new Error("TagFrequencyReportItem does not have a viewUrl");
  }
}

export class TagDielActivityReportItem extends AbstractModelWithoutId {
  public readonly kind: string = "TagDielActivityReportItem";

  public readonly range!: Range<number>;
  public readonly tags!: TagEventCount[];

  public constructor(
    data: { range: Range<number>; tags: { tagId: number; events: number }[] },
    injector?: AssociationInjector,
  ) {
    super(data, injector);
    this.tags = data.tags.map((tag) => new TagEventCount(tag, injector));
    this.range = data.range;
  }

  public get viewUrl(): string {
    throw new Error("TagDielActivityReportItem does not have a viewUrl");
  }
}

export class EventSummaryItem extends AbstractModelWithoutId {
  public readonly kind: string = "EventSummaryItem";
  public readonly tagId!: number;
  public readonly provenanceId!: number | null;
  public readonly events!: number;
  public readonly scoreMean!: number | null;
  public readonly scoreStddev!: number | null;
  public readonly scoreMinimum!: number | null;
  public readonly scoreMaximum!: number | null;
  public readonly scoreHistogram!: Histogram | null;

  @hasOne(TAG, "tagId")
  public readonly tag?: Tag;
  @hasOne(AUDIO_EVENT_PROVENANCE, "provenanceId")
  public readonly provenance?: Provenance;

  public constructor(
    data: {
      tagId: number;
      provenanceId: number | null;
      events: number;
      scoreMean: number | null;
      scoreStddev: number | null;
      scoreMinimum: number | null;
      scoreMaximum: number | null;
      scoreHistogram: IHistogram | null;
    },
    injector?: AssociationInjector,
  ) {
    super(data, injector);
    this.scoreHistogram = data.scoreHistogram
      ? new Histogram(data.scoreHistogram)
      : null;
  }

  public get viewUrl(): string {
    throw new Error("EventSummaryItem does not have a viewUrl");
  }
}

export class AudioRecordingCoverageItem extends AbstractModelWithoutId {
  public readonly kind: string = "AudioRecordingCoverageItem";
  public readonly siteId!: number;

  @bawDateTimeRange()
  public readonly range!: Range<DateTime>;
  public readonly density!: number;
  public readonly gapThreshold!: number;

  @hasOne(SITE, "siteId")
  public readonly site?: Site;

  public get viewUrl(): string {
    throw new Error("AudioRecordingCoverageItem does not have a viewUrl");
  }
}

export class AnalysisCoverageItem extends AudioRecordingCoverageItem {
  public override readonly kind: string = "AnalysisCoverageItem";
  public readonly result!: AnalysisJobItemResultStatus;

  public get viewUrl(): string {
    throw new Error("AnalysisCoverageItem does not have a viewUrl");
  }
}
