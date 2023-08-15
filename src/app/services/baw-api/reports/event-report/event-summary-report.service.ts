import { Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import {
  IdParamOptional,
  id,
  option,
  ApiFilterShow,
  emptyParam,
} from "@baw-api/api-common";
import { ApiResponse, BawApiService, Filters } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import {
  BawProvider,
  BawResolver,
  ResolvedModel,
} from "@baw-api/resolver-common";
import { EventSummaryReportParameters } from "@components/reports/pages/event-summary/EventSummaryReportParameters";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { EventGroup } from "@models/EventGroup";
import {
  EventSummaryReport,
  IEventSummaryReport,
} from "@models/EventSummaryReport";
import { Observable, map, of } from "rxjs";

// at the current moment, the api does not support fetching saved reports from id
// however, this is planned for the future, so the service has been backfilled to support this
const reportId: IdParamOptional<EventSummaryReport> = id;
// TODO: remove this TypeScript exception once the API is fully functional
const endpoint = stringTemplate`/reports/audio_event_summary/${reportId}${option}`;

@Injectable()
export class EventSummaryReportService
  implements ApiFilterShow<EventSummaryReport>
{
  public constructor(
    protected session: BawSessionService,
    protected api: BawApiService<EventSummaryReport>
  ) {}

  // because filter returns an array of item, and we want to return one item given filter conditions
  // we cannot use the generalised filter service interface
  public filterShow(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filters: Filters<EventSummaryReport>
  ): Observable<EventSummaryReport> {
    const regionIds: number[] = [14, 7];
    const siteIds: number[] = [3600, 3609, 3332, 3331];
    const provenanceIds: number[] = [1];
    const tagIds: number[] = [1, 1950, 39, 277];

    // hard coded graph and statics data was used to generate "realistic" event summary reports
    // faker.js was not used as it is a dev-dependency and would significantly increase the initial bundle size
    const fakeReport: IEventSummaryReport = {
      siteIds,
      regionIds,
      // remove this before review as it's not in line with the spec
      tagIds,
      // same with this line
      provenanceIds,
      name: "Mock Event Summary Report",
      generatedDate: "2023-07-07T00:00:00.0000000",
      eventGroups: [
        new EventGroup({
          provenanceId: 1,
          tagId: 1,
          detections: 55,
          bucketsWithDetections: 0.7,
          bucketsWithInterference: [],
          score: {
            histogram: [
              // these values should be rounded to 1 decimal place in the confidence plot
              0.91, 0.82, 0.71, 0.71, 0.62, 0.63, 0.54, 0.52, 0.51, 0.51, 0.41, 0.4, 0.30,
              0.32, 0.22, 0.13,
            ],
            standardDeviation: 0.2,
            mean: 0.5,
            min: 0.1,
            max: 0.9,
          },
        }),
        new EventGroup({
          provenanceId: 1,
          tagId: 1950,
          detections: 55,
          bucketsWithDetections: 0.7,
          bucketsWithInterference: [],
          score: {
            histogram: [
              0.1, 0.2, 0.3, 0.3, 0.6, 0.6, 0.5, 0.2, 0.5, 0.5, 0.4, 0.4, 0.3,
              0.3, 0.5, 0.1, 0.7, 0.7, 0.6, 0.7, 0.8, 0.8, 0.9
            ],
            standardDeviation: 0.4,
            mean: 0.6,
            min: 0.4,
            max: 0.98,
          },
        }),
        new EventGroup({
          provenanceId: 1,
          tagId: 39,
          detections: 55,
          bucketsWithDetections: 0.7,
          bucketsWithInterference: [],
          score: {
            histogram: [
              0.2, 0.5, 0.4, 0.4, 0.3, 0.3, 0.6, 0.2, 0.4, 0.3, 0.1, 0.4, 0.3,
              0.3, 0.3, 0.1, 0.6, 0.7, 0.8, 0.9
            ],
            standardDeviation: 0.1,
            mean: 0.3,
            min: 0.1,
            max: 0.3,
          },
        }),
        new EventGroup({
          provenanceId: 1,
          tagId: 277,
          detections: 55,
          bucketsWithDetections: 0.7,
          bucketsWithInterference: [],
          score: {
            histogram: [
              0.9, 0.1, 0.7, 0.7, 0.6, 0.3, 0.5, 0.3, 0.5, 0.2, 0.4, 0.4, 0.3,
              0.3, 1, 0.9,
            ],
            standardDeviation: 0.2,
            mean: 0.5,
            min: 0.1,
            max: 0.9,
          },
        }),
      ],
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
          { date: "2023-05-22", count: 0, error: 0 },
          { date: "2023-05-23", count: 3, error: 0 },
          { date: "2023-05-24", count: 9, error: 1 },
          { date: "2023-05-25", count: 15, error: 1 },
          { date: "2023-05-26", count: 17, error: 2 },
          { date: "2023-05-27", count: 18, error: 2 },
          { date: "2023-05-28", count: 18, error: 2 },
          { date: "2023-05-29", count: 20, error: 3 },
        ],
        speciesCompositionData: [
          { date: "2023-05-22", tagId: 1, ratio: 0.55 },
          { date: "2023-05-22", tagId: 39, ratio: 0.3 },
          { date: "2023-05-22", tagId: 277, ratio: 0.15 },
          { date: "2023-05-23", tagId: 1, ratio: 0.45 },
          { date: "2023-05-23", tagId: 39, ratio: 0.2 },
          { date: "2023-05-23", tagId: 277, ratio: 0.35 },
          { date: "2023-05-24", tagId: 1, ratio: 0.05 },
          { date: "2023-05-24", tagId: 39, ratio: 0.25 },
          { date: "2023-05-24", tagId: 277, ratio: 0.7 },
          { date: "2023-05-25", tagId: 1, ratio: 0.5 },
          { date: "2023-05-25", tagId: 39, ratio: 0.2 },
          { date: "2023-05-25", tagId: 277, ratio: 0.3 },
          { date: "2023-05-26", tagId: 1, ratio: 0.25 },
          { date: "2023-05-26", tagId: 39, ratio: 0.4 },
          { date: "2023-05-26", tagId: 277, ratio: 0.35 },
          { date: "2023-05-27", tagId: 1, ratio: 0.15 },
          { date: "2023-05-27", tagId: 39, ratio: 0.3 },
          { date: "2023-05-27", tagId: 277, ratio: 0.55 },
          { date: "2023-05-28", tagId: 1, ratio: 0.1 },
          { date: "2023-05-28", tagId: 39, ratio: 0.2 },
          { date: "2023-05-28", tagId: 277, ratio: 0.7 },
          { date: "2023-05-29", tagId: 1, ratio: 0.05 },
          { date: "2023-05-29", tagId: 39, ratio: 0.15 },
          { date: "2023-05-29", tagId: 277, ratio: 0.8 },
          { date: "2023-05-30", tagId: 1, ratio: 0.05 },
          { date: "2023-05-30", tagId: 39, ratio: 0.1 },
          { date: "2023-05-30", tagId: 277, ratio: 0.85 },
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
            { startDate: "2020-10-19", endDate: "2020-10-20" },
            { startDate: "2020-10-26", endDate: "2020-11-01" },
            { startDate: "2020-11-10", endDate: "2020-12-01" },
            { startDate: "2020-12-01", endDate: "2020-12-18" },
            { startDate: "2021-01-01", endDate: "2021-04-11" },
            { startDate: "2021-08-10", endDate: "2021-10-11" },
          ],
        },
        // TODO: I might be able to remove this
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
    };

    //we have to create a fake response so that we can add the correct injection service
    const fakeResponse: ApiResponse<IEventSummaryReport> = {
      meta: {
        status: 200,
        message: "OK",
      },
      data: fakeReport,
    };

    // using the api.handleSingleResponse method, we can create a model with the correct injected services
    return of(fakeResponse).pipe(
      map(this.api.handleSingleResponse(EventSummaryReport))
    );
    // return this.api.filterShow(EventSummaryReport, endpoint(emptyParam, filterParam), filters);
  }

  public downloadEventsTableUrl(filters: Filters<EventSummaryReport>): string {
    return endpoint(emptyParam, emptyParam) + "events.csv?" + this.api.encodeFilter(filters);
  }
}

interface ResolverNames {
  filterShow: string;
}

// the creation of a EventSummaryReport involves getting query string parameters, serializing them as a filter request through a data model
// and sending the request to the server to fetch the EventSummaryReports model.
// as we have already fetched the query string parameter data model, we should keep it in route data for future use
class EventSummaryReportResolver extends BawResolver<
  [EventSummaryReport, any],
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
    resolver: Type<
      Resolve<ResolvedModel<[EventSummaryReport, EventSummaryReportParameters]>>
    >,
    deps: Type<EventSummaryReportService>[]
  ): ResolverNames & { providers: BawProvider[] } {
    const filterShowProvider = {
      filterShow: name + "CreateFromFilterResolver",
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
  ): Observable<[EventSummaryReport, EventSummaryReportParameters]> {
    const fakeEvents = [ 1, 2, 1950, 39, 277 ];
    const fakeProvenances = [ 1 ];

    const parametersModel = new EventSummaryReportParameters(route.queryParams);

    parametersModel.tags = fakeEvents;
    parametersModel.provenances = fakeProvenances;

    const filters: Filters<EventSummaryReport> = parametersModel.toFilter();

    // because we are returning the data model that was used to fetch the reports model
    // we need to unpack the model response and create a new observable that encapsulates both the report and data model
    return new Observable<[EventSummaryReport, EventSummaryReportParameters]>(
      (subscriber) => {
        api.filterShow(filters).subscribe((data: EventSummaryReport) => {
          parametersModel.injector = data["injector"];

          subscriber.next([
            data,
            parametersModel
          ]);
          subscriber.complete();
        });
      }
    );
  }
}

export class EventSummaryReportResolverNative {
  public userResolver() {
  }
}

export const eventSummaryResolvers = new EventSummaryReportResolver([
  EventSummaryReportService,
]).create("AudioEventSummaryReport");
