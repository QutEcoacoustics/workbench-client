import {
  AUDIO_EVENT_PROVENANCE,
  SHALLOW_REGION,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import {
  CollectionIds,
  DateTimeTimezone,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { EventSummaryReportParameters } from "@components/reports/pages/event-summary/EventSummaryReportParameters";
import { reportMenuItems } from "@components/reports/reports.menu";
import { AbstractModel } from "./AbstractModel";
import { hasMany } from "./AssociationDecorators";
import { bawCollection, bawDateTime } from "./AttributeDecorators";
import { Site } from "./Site";
import { Region } from "./Region";
import { EventGroup } from "./AudioEventProvenance/EventGroup";
import { IAudioEventSummaryReportStatistics } from "./AudioEventProvenance/ReportStatistics";
import { IEventSummaryGraphs } from "./AudioEventProvenance/ReportGraphs";
import { Tag } from "./Tag";
import { AudioEventProvenance } from "./AudioEventProvenance";

export interface IEventSummaryReport {
  id?: Id;
  name: Param;
  generatedDate: DateTimeTimezone | string;
  statistics: IAudioEventSummaryReportStatistics;
  eventGroups: EventGroup[];
  siteIds: CollectionIds;
  regionIds: CollectionIds;
  tagIds: CollectionIds;
  provenanceIds: CollectionIds;
  graphs: IEventSummaryGraphs;
}

//! the api endpoint associated with this model is not currently implemented. Therefore this model is a draft and subject to change
export class EventSummaryReport
  extends AbstractModel<IEventSummaryReport>
  implements IEventSummaryReport
{
  public readonly kind = "AudioEventSummaryReport";
  public readonly id?: Id;
  public readonly name: Param;
  @bawDateTime()
  public readonly generatedDate: DateTimeTimezone;
  public readonly statistics: IAudioEventSummaryReportStatistics;
  public readonly eventGroups: EventGroup[];
  @bawCollection()
  public readonly siteIds: CollectionIds;
  @bawCollection()
  public readonly regionIds: CollectionIds;
  public readonly graphs: IEventSummaryGraphs;
  @bawCollection()
  public readonly tagIds: CollectionIds;
  @bawCollection()
  public readonly provenanceIds: CollectionIds;
  public readonly generationParameters?: EventSummaryReportParameters;

  // associations
  @hasMany<EventSummaryReport, Region>(SHALLOW_REGION, "regionIds")
  public regions?: Region[];
  @hasMany<EventSummaryReport, Site>(SHALLOW_SITE, "siteIds")
  public sites?: Site[];
  @hasMany<EventSummaryReport, Tag>(TAG, "tagIds")
  public tags?: Tag[];
  @hasMany<EventSummaryReport, AudioEventProvenance>(
    AUDIO_EVENT_PROVENANCE,
    "provenanceIds"
  )
  public provenances?: AudioEventProvenance[];

  public get viewUrl(): string {
    const reportLevel = this.generationParameters.sites
      ? "site"
      : this.generationParameters.regions.length
      ? "region"
      : "project";

    const route: string =
      reportMenuItems.view[reportLevel].route.toRouterLink();
    const routeParameters: string = this.generationParameters
      .toQueryParams()
      .toString();

    return route + routeParameters;
  }
}
