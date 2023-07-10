import { Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { IdParamOptional, id, option, FilterCreate } from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import {
  BawProvider,
  BawResolver,
  ResolvedModel,
} from "@baw-api/resolver-common";
import { EventSummaryReportParameters } from "@components/reports/pages/event-summary/EventSummaryReportParameters";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { EventSummaryReport, IEventGroup } from "@models/EventSummaryReport";
import { Observable, of } from "rxjs";

// at the current moment, the api does not support fetching saved reports from id. However, this is planned for the future
// to backfill in preparation, this service has been backfilled
const reportId: IdParamOptional<EventSummaryReport> = id;
// TODO: remove this TypeScript exception once the API is fully functional
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const endpoint = stringTemplate`/reports/audio_event_summary/${reportId}${option}`;

@Injectable()
export class EventSummaryReportService
  implements FilterCreate<EventSummaryReport>
{
  public constructor(protected api: BawApiService<EventSummaryReport>) {}

  // because filter returns an array of item, and we want to return one item given filter conditions
  // we cannot use the generalised filter service interface
  public filterShow(
    filters: Filters<EventSummaryReport>
  ): Observable<EventSummaryReport> {
    // as the api is not currently functional, we are returning a mock report model
    // this is done so that the reports can be showcased with a working view

    // to make the report believable, we have to use the filter parameters so that it uses actual sites, tags, etc...
    const filterConditions: object[] = filters.filter.and as object[];

    const sideIdFilter = filterConditions.find(
      (filterCondition) => "site.id" in filterCondition
    );

    const provenanceIdFilter = filterConditions.find(
      (filterCondition) => "provenance.id" in filterCondition
    );

    const tagIdFilter = filterConditions.find(
      (filterCondition) => "tag.id" in filterCondition
    );

    const siteIds: number[] = sideIdFilter
      ? sideIdFilter["site.id"].in
      : [];
    const provenanceIds: number[] = provenanceIdFilter
      ? provenanceIdFilter["provenance.id"].in
      : [];
    const tagIds: number[] = tagIdFilter ? tagIdFilter["tag.id"].in : [];

    const eventGroups: IEventGroup[] = tagIds
      ?.map((tagId: number): IEventGroup[] =>
        provenanceIds.map(
          (provenanceId: number): IEventGroup => ({
            provenanceId,
            tagId,
            detections: 55,
            bucketsWithDetections: 0.7,
            bucketsWithInterference: [],
            score: {
              histogram: [
                0.9, 0.8, 0.7, 0.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.5, 0.4, 0.4, 0.3,
                0.3, 0.2, 0.1,
              ],
              standardDeviation: 0.2,
              mean: 0.5,
              min: 0.1,
              max: 0.9,
            },
          })
        )
      )
      .flat();

    const fakeReport: EventSummaryReport = new EventSummaryReport({
      siteIds,
      name: "Mock Event Summary Report",
      generatedDate: "2023-07-07T00:00:00.0000000",
      eventGroups,
      statistics: {
        totalSearchSpan: 256,
        audioCoverageOverSpan: 128,
        analysisCoverageOverSpan: 64,
        countOfRecordingsAnalyzed: 221,
        coverageStartDay: "2023-01-01:00:00:00.0000000",
        coverageEndDay: "2023-12-01:00:00:00.0000000",
      },
      graphs: {
        accumulationData: [
          { date: "22-05-2023", count: 5.25, error: 1.5 },
          { date: "23-05-2023", count: 9.75, error: 1.25 },
          { date: "24-05-2023", count: 12.5, error: 1.1 },
          { date: "25-05-2023", count: 12.5, error: 1.3 },
          { date: "26-05-2023", count: 12.9, error: 1.2 },
          { date: "27-05-2023", count: 12.93, error: 1.4 },
          { date: "28-05-2023", count: 13.2, error: 1.15 },
          { date: "29-05-2023", count: 13.5, error: 1.05 },
        ],
        speciesCompositionData: [
          { date: "22-05-2023", tagId: 1, ratio: 0.55 },
          { date: "22-05-2023", tagId: 39, ratio: 0.3 },
          { date: "22-05-2023", tagId: 277, ratio: 0.15 },
          { date: "23-05-2023", tagId: 1, ratio: 0.45 },
          { date: "23-05-2023", tagId: 39, ratio: 0.2 },
          { date: "23-05-2023", tagId: 277, ratio: 0.35 },
          { date: "24-05-2023", tagId: 1, ratio: 0.05 },
          { date: "24-05-2023", tagId: 39, ratio: 0.25 },
          { date: "24-05-2023", tagId: 277, ratio: 0.7 },
          { date: "25-05-2023", tagId: 1, ratio: 0.5 },
          { date: "25-05-2023", tagId: 39, ratio: 0.2 },
          { date: "25-05-2023", tagId: 277, ratio: 0.3 },
          { date: "26-05-2023", tagId: 1, ratio: 0.25 },
          { date: "26-05-2023", tagId: 39, ratio: 0.4 },
          { date: "26-05-2023", tagId: 277, ratio: 0.35 },
          { date: "27-05-2023", tagId: 1, ratio: 0.15 },
          { date: "27-05-2023", tagId: 39, ratio: 0.3 },
          { date: "27-05-2023", tagId: 277, ratio: 0.55 },
          { date: "28-05-2023", tagId: 1, ratio: 0.1 },
          { date: "28-05-2023", tagId: 39, ratio: 0.2 },
          { date: "28-05-2023", tagId: 277, ratio: 0.7 },
          { date: "29-05-2023", tagId: 1, ratio: 0.05 },
          { date: "29-05-2023", tagId: 39, ratio: 0.15 },
          { date: "29-05-2023", tagId: 277, ratio: 0.8 },
          { date: "30-05-2023", tagId: 1, ratio: 0.05 },
          { date: "30-05-2023", tagId: 39, ratio: 0.1 },
          { date: "30-05-2023", tagId: 277, ratio: 0.85 },
        ],
        coverageData: {
          recordingCoverage: [
            { startDate: "2020-10-10", endDate: "2020-10-11" },
            { startDate: "2020-10-12", endDate: "2020-10-15" },
            { startDate: "2020-10-19", endDate: "2020-10-23" },
            { startDate: "2020-10-26", endDate: "2020-11-01" },
            { startDate: "2020-11-10", endDate: "2020-12-01" },
            { startDate: "2020-12-01", endDate: "2020-12-28" },
            { startDate: "2021-01-01", endDate: "2021-04-11" },
            { startDate: "2021-08-10", endDate: "2021-10-11" },
          ],
          analysisCoverage: [
            { startDate: "2020-10-10", endDate: "2020-10-11" },
            { startDate: "2020-10-12", endDate: "2020-10-15" },
            { startDate: "2020-10-19", endDate: "2020-10-09" },
            { startDate: "2020-10-26", endDate: "2020-11-01" },
            { startDate: "2020-11-10", endDate: "2020-12-01" },
            { startDate: "2020-12-01", endDate: "2020-12-28" },
            { startDate: "2021-01-01", endDate: "2021-04-11" },
            { startDate: "2021-08-10", endDate: "2021-10-11" },
          ],
        },
        analysisConfidenceData: [
          { date: "2023-01-02", audioCoverage: 0.5, analysisCoverage: 0.5 },
          { date: "2023-01-03", audioCoverage: 0.6, analysisCoverage: 0.5 },
          { date: "2023-01-04", audioCoverage: 0.3, analysisCoverage: 0.2 },
          { date: "2023-01-05", audioCoverage: 0.4, analysisCoverage: 0.1 },
          { date: "2023-01-06", audioCoverage: 0.8, analysisCoverage: 0.5 },
          { date: "2023-01-07", audioCoverage: 0.2, analysisCoverage: 0.1 },
          { date: "2023-01-08", audioCoverage: 0.1, analysisCoverage: 0.0 },
        ],
      },
    });

    return of(fakeReport);
    // return this.api.filterShow(EventSummaryReport, endpoint(emptyParam, filterParam), filters);
  }
}

// when fetching the EventSummaryReports from route data, query string parameters are used to construct a filter request
// therefore, we have to create a custom resolver to handle fetch an object using query string parameters
interface ResolverNames {
  filterShow: string;
  parameterDataModel: string;
}
class EventSummaryReportResolver extends BawResolver<
  EventSummaryReport,
  EventSummaryReport,
  [],
  EventSummaryReportService,
  ResolverNames
> {
  public constructor(dependencies: Type<EventSummaryReportService>[]) {
    super(dependencies);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<EventSummaryReport>>>,
    deps: Type<EventSummaryReportService>[]
  ): ResolverNames & { providers: BawProvider[] } {
    const filterShowProvider = {
      filterShow: name + "CreateFromFilterResolver",
      parameterDataModel: name + "ParameterDataResolver",
      providers: [
        {
          provide: name + "CreateFromFilterResolver",
          useClass: resolver,
          deps,
        },
      ],
    };

    return filterShowProvider;
  }

  public resolverFn(
    route: ActivatedRouteSnapshot,
    api: EventSummaryReportService
  ): Observable<EventSummaryReport> {
    const parametersModel = new EventSummaryReportParameters(route.queryParams);
    const filters: Filters<EventSummaryReport> = parametersModel.toFilter();

    return api.filterShow(filters);
  }
}

export const eventSummaryResolvers = new EventSummaryReportResolver([
  EventSummaryReportService,
]).create("AudioEventSummaryReport");
