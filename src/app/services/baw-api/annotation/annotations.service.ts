import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { IdOr, ReadonlyApi } from "@baw-api/api-common";
import { AudioEventTagsService } from "@baw-api/audio-event/audio-event-tags.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { Resolvers } from "@baw-api/resolver-common";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Annotation, IAnnotation } from "@models/Annotation";
import type { IAudioEvent } from "@models/AudioEvent";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AnnotationsService extends ReadonlyApi<Annotation> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    private audioEventsApi: ShallowAudioEventsService
  ) {
    super(http, apiRoot, Annotation, injector);
  }

  list(): Observable<Annotation[]> {
    return this.audioEventsApi.list().pipe(
      map((audioEvents) => {
        return audioEvents.map(
          (audioEvent) => new Annotation(audioEvent, this.injector)
        );
      })
    );
  }
  // TODO Utilize filters to filter projects/sites
  filter(
    filters: Filters<IAnnotation>,
    audioEventFilters?: Filters<IAudioEvent>
  ): Observable<Annotation[]> {
    return this.audioEventsApi
      .filter({
        paging: filters.paging,
        sorting: filters.sorting,
        projection: audioEventFilters?.projection,
        filter: {
          ...audioEventFilters?.filter,
          ...filters,
        },
      })
      .pipe(
        map((audioEvents) =>
          audioEvents.map(
            (audioEvent) => new Annotation(audioEvent, this.injector)
          )
        )
      );
  }
  show(model: IdOr<Annotation>): Observable<Annotation> {
    return this.audioEventsApi
      .show(model["id"] ? model["id"] : model)
      .pipe(map((audioEvent) => new Annotation(audioEvent, this.injector)));
  }
}

export const annotationResolvers = new Resolvers<
  Annotation,
  AnnotationsService
>(
  [
    AnnotationsService,
    AudioEventTagsService,
    AudioRecordingsService,
    ShallowAudioEventsService,
    ShallowSitesService,
    TagsService,
  ],
  "annotationId"
).create("Annotation");
