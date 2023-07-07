import { Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import {
  IdParamOptional,
  id,
  option,
  FilterCreate,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { BawProvider, BawResolver, ResolvedModel } from "@baw-api/resolver-common";
import { EventSummaryReportParameters } from "@components/reports/pages/event-summary/EventSummaryReportParameters";
import { faker } from "@faker-js/faker";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { EventSummaryReport, IEventGroup } from "@models/EventSummaryReport";
import { generateEventSummaryReport } from "@test/fakes/EventSummaryReport";
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
    const siteIds: number[] = filters.filter.and[1]["site.id"].in;
    const provenanceIds: number[] = filters.filter.and[2]["provenance.id"].in;
    const tagIds: number[] = filters.filter.and[3]["tag.id"].in;

    function flatten2DArray(arr) {
      return [].concat(...arr);
    }

    return of(
      new EventSummaryReport(
        generateEventSummaryReport({
          siteIds,
          eventGroups: flatten2DArray(tagIds.map((tagId: number) =>
            provenanceIds.map((provenanceId: number) =>
              Object({
                provenanceId,
                tagId,
                detections: faker.datatype.number(),
                bucketsWithDetections: faker.datatype.number(),
                bucketsWithInterference: [],
                score: Object({
                  histogram: faker.helpers.arrayElements(
                    [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                    30
                  ),
                  standardDeviation: faker.datatype.number({ min: 0, max: 1, precision: 0.001 }),
                  mean: faker.datatype.number({ min: 0, max: 1, precision: 0.001 }),
                  min: faker.datatype.number({ min: 0, max: 1, precision: 0.001 }),
                  max: faker.datatype.number({ min: 0, max: 1, precision: 0.001 }),
                }),
              } as IEventGroup)
            )
          )),
        })
      )
    );
    // return this.api.filterShow(EventSummaryReport, endpoint(emptyParam, filterParam), filters);
  }
}

// when fetching the EventSummaryReports from route data, query string parameters are used to construct a filter request
// therefore, we have to create a custom resolver to handle fetch an object using query string parameters
interface ResolverNames {
  filterShow: string,
  parameterDataModel: string,
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
        { provide: name + "CreateFromFilterResolver", useClass: resolver, deps },
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
