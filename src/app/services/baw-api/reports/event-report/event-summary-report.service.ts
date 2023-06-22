import { EnvironmentInjector, Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import {
  IdParamOptional,
  id,
  option,
  emptyParam,
  ApiFilterShow,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { BawResolver, ResolvedModel } from "@baw-api/resolver-common";
import { EventSummaryReportParameters } from "@components/reports/pages/event-summary/EventSummaryReportParameters";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { generateEventSummaryReport } from "@test/fakes/EventSummaryReport";
import { Observable, of } from "rxjs";

// at the current moment, the api does not support fetching saved reports from id. However, this is planned for the future
// to backfill in preparation, this service has been backfilled
const reportId: IdParamOptional<EventSummaryReport> = id;
const endpoint = stringTemplate`/reports/audio_event_summary/${reportId}${option}`;

@Injectable()
export class EventSummaryReportService
  implements ApiFilterShow<EventSummaryReport>
{
  public constructor(protected api: BawApiService<EventSummaryReport>) {}

  // because filter returns an array of item, and we want to return one item given filter conditions
  // we cannot use the generalised filter service interface
  // TODO: this should fetch a response from the API once the API is complete rather than returning a fake model
  public filterShow(
    filters: Filters<EventSummaryReport>
  ): Observable<EventSummaryReport> {
    // as the api is not currently functional, we are returning a mock report model
    // this is done so that the reports can be showcased with a working view
    // TODO: remove the following line of code once the API is fully functional
    return of(new EventSummaryReport(generateEventSummaryReport()));
    return this.api.filterShow(EventSummaryReport, endpoint(emptyParam, emptyParam), filters);
  }
}

// when fetching the EventSummaryReports from route data, query string parameters are used to construct a filter request
// therefore, we have to create a custom resolver to handle fetch an object using query string parameters
class EventSummaryReportResolver extends BawResolver<
  EventSummaryReport,
  EventSummaryReport,
  [],
  EventSummaryReportService,
  { filterShow: string }
> {
  public constructor(dependencies: Type<EventSummaryReportService>[]) {
    super(dependencies);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<EventSummaryReport>>>,
    deps: Type<EventSummaryReportService>[]
  ) {
    const filterShowProvider = {
      filterShow: name + "FilterShowResolver",
      providers: [
        { provide: name + "FilterShowResolver", useClass: resolver, deps },
      ],
    };

    return filterShowProvider;
  }

  public resolverFn(
    route: ActivatedRouteSnapshot,
    api: EventSummaryReportService
  ): Observable<EventSummaryReport> {
    const parametersModel = new EventSummaryReportParameters(
      route.paramMap.getAll("sites").map((uid) => parseInt(uid, 10)),
      route.paramMap.getAll("points").map((uid) => parseInt(uid, 10)),
      route.paramMap.getAll("provenances").map((uid) => parseInt(uid, 10)),
      route.paramMap.getAll("events").map((uid) => parseInt(uid, 10)),
      parseInt(route.paramMap.get("provenanceCutOff"), 10),
      route.paramMap.getAll("charts")
    );
    const filters: Filters<EventSummaryReport> = parametersModel.toFilter();

    return api.filterShow(filters);
  }
}

export const eventSummaryResolvers = new EventSummaryReportResolver([
  EventSummaryReportService,
]).create("AudioEventSummaryReport");
