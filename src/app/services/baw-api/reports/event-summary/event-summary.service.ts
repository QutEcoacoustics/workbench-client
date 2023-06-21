import { Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, Params, Resolve } from "@angular/router";
import { IdParamOptional, id, option } from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import {
  BawResolver,
  ResolvedModel,
} from "@baw-api/resolver-common";
import { EventSummaryReportParameters } from "@components/reports/pages/event-summary/eventSummaryParameters";
import { Tuple } from "@helpers/advancedTypes";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEventSummaryReport } from "@models/AudioEventSummaryReport";
import { generateAudioEventSummaryReport } from "@test/fakes/AudioEventSummaryReport";
import { Observable, of } from "rxjs";

// at the current moment, the api does not support fetching saved reports from id. However, this is planned for the future
// to backfill in preparation, this service has been backfilled
const reportId: IdParamOptional<AudioEventSummaryReport> = id;
const endpoint = stringTemplate`/reports/audio_event_summary/${reportId}${option}`;

@Injectable()
export class EventSummaryReportService {
  public constructor(protected api: BawApiService<AudioEventSummaryReport>) {}

  // because filter returns an array of item, and we want to return one item given filter conditions
  // we cannot use the generalised filter service interface
  // TODO: generalise this service to an interface if more report types are added
  public filterShow(
    filters: Filters<AudioEventSummaryReport>
  ): Observable<AudioEventSummaryReport> {
    return of(new AudioEventSummaryReport(generateAudioEventSummaryReport()));
  }

  public show() {
    return of(new AudioEventSummaryReport(generateAudioEventSummaryReport()));
  }
}

// when fetching the EventSummaryReports from route data, query string parameters are used to construct a filter request
// therefore, we have to create a custom resolver to handle fetch an object using query string parameters
class EventSummaryResolver extends BawResolver<
  AudioEventSummaryReport,
  AudioEventSummaryReport,
  [],
  EventSummaryReportService,
  { filterShow: string }
> {
  public constructor(
    deps: Type<EventSummaryReportService>[],
    params?: Tuple<string, Params["length"]>
  ) {
    super(deps, undefined, params);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<AudioEventSummaryReport>>>,
    deps: Type<EventSummaryReportService>[]
  ) {
    const filterShowProvider = {
      filterShow: name + "FilterShowResolver",
      providers: [{ provide: name + "FilterShowResolver", useClass: resolver, deps }],
    };

    return filterShowProvider;
  }

  public resolverFn(
    route: ActivatedRouteSnapshot,
    api: EventSummaryReportService
  ): Observable<AudioEventSummaryReport> {
    const parametersModel = new EventSummaryReportParameters(
      route.paramMap.getAll("sites").map((uid) => parseInt(uid, 10)),
      route.paramMap.getAll("points").map((uid) => parseInt(uid, 10)),
      route.paramMap.getAll("provenances").map((uid) => parseInt(uid, 10)),
      route.paramMap.getAll("events").map((uid) => parseInt(uid, 10)),
      parseInt(route.paramMap.get("provenanceCutOff"), 10),
      route.paramMap.getAll("charts")
    );
    const filters = parametersModel.toFilter();

    return api.filterShow(filters);
  }
}

class ReportResolvers {
  public create(name: string) {
    const tagTypeProvider = new EventSummaryResolver([
      EventSummaryReportService,
    ]).create(name);
    const providers = [
      ...tagTypeProvider.providers,
    ];

    const resolver = {
      ...tagTypeProvider,
      providers,
    };

    return resolver;
  }
}

export const eventSummaryResolvers = new ReportResolvers().create("AudioEventSummaryReport");
