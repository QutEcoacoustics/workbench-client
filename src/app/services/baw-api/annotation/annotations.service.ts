import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { IdOr, ReadonlyApi } from "@baw-api/api-common";
import { AudioEventTagsService } from "@baw-api/audio-event/audio-event-tags.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { Resolvers } from "@baw-api/resolver-common";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Annotation, IAnnotation } from "@models/Annotation";
import type { AudioEvent, IAudioEvent } from "@models/AudioEvent";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AnnotationsService extends ReadonlyApi<Annotation, []> {
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
        return audioEvents.map((audioEvent) =>
          this.createAnnotation(audioEvent)
        );
      })
    );
  }
  // TODO Utilize filters to filter projects/sites
  filter(
    filters: Filters<IAnnotation>,
    audioEventFilters?: Filters<IAudioEvent>
  ): Observable<Annotation[]> {
    return this.audioEventsApi.filter(audioEventFilters).pipe(
      map((audioEvents) => {
        return audioEvents.map((audioEvent) =>
          this.createAnnotation(audioEvent)
        );
      })
    );
  }
  show(model: IdOr<Annotation>): Observable<Annotation> {
    return this.audioEventsApi
      .show(model["id"] ? model["id"] : model)
      .pipe(map((audioEvent) => this.createAnnotation(audioEvent)));
  }

  private createAnnotation(audioEvent: AudioEvent) {
    const annotation = new Annotation({ id: audioEvent.id }, this.injector);
    annotation.setAudioEvent(audioEvent);
    return annotation;
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
