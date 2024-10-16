import { Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import {
  BawProvider,
  BawResolver,
  ResolvedModel,
} from "@baw-api/resolver-common";
import { TagsService } from "@baw-api/tag/tags.service";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Annotation } from "@models/data/Annotation";
import { Tag } from "@models/Tag";
import { MediaService } from "@services/media/media.service";
import { firstValueFrom, Observable, of } from "rxjs";

@Injectable()
export class AnnotationService {
  public constructor(
    private tagsApi: TagsService,
    private audioRecordingsApi: AudioRecordingsService,
    private mediaService: MediaService
  ) {}

  public async show(audioEvent: AudioEvent): Promise<Annotation> {
    const tags = await this.showTags(audioEvent);
    const audioRecording = await this.showAudioRecording(audioEvent);
    const audioLink = this.mediaService.createMediaUrl(
      audioRecording,
      audioEvent.startTimeSeconds,
      audioEvent.endTimeSeconds
    );

    // TODO: this is a tempoary patch for ecoacoustics/web-components#213
    // until it is fixed upstream
    const tagDescriptor = tags.map((tag) => tag.text).join(", ");

    const data = {
      ...audioEvent,
      tags: tagDescriptor,
      audioLink,
      audioRecording,
    };

    return new Annotation(data);
  }

  private async showTags(audioEvent: AudioEvent): Promise<Tag[]> {
    const tagIds = audioEvent.taggings.map((tagging) => tagging.tagId);
    return await firstValueFrom(
      this.tagsApi.filter({
        filter: {
          id: {
            in: tagIds,
          },
        } as any,
      })
    );
  }

  private async showAudioRecording(
    audioEvent: AudioEvent
  ): Promise<AudioRecording> {
    return new AudioRecording(
      await firstValueFrom(
        this.audioRecordingsApi.show(audioEvent.audioRecordingId)
      )
    );
  }
}

interface ResolverNames {
  showOptional: string;
}

class AnnotationResolver extends BawResolver<
  AnnotationSearchParameters,
  undefined,
  [],
  undefined,
  ResolverNames
> {
  public createProviders(
    name: string,
    resolver: Type<{
      resolve: ResolveFn<ResolvedModel<AnnotationSearchParameters>>;
    }>,
    deps: []
  ): ResolverNames & { providers: BawProvider[] } {
    const showOptionalProvider = {
      showOptional: name + "ShowOptionalResolver",
      providers: [
        {
          provide: name + "ShowOptionalResolver",
          useClass: resolver,
          deps,
        },
      ],
    };

    return showOptionalProvider;
  }

  public resolverFn(
    route: ActivatedRouteSnapshot
  ): Observable<AnnotationSearchParameters> {
    const parameterModel = new AnnotationSearchParameters(route.queryParams);
    return of(parameterModel);
  }
}

export const annotationResolvers = new AnnotationResolver([]).create(
  "Annotations"
);
