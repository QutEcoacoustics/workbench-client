import { Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import {
  BawProvider,
  BawResolver,
  ResolvedModel,
} from "@baw-api/resolver-common";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Annotation } from "@models/data/Annotation";
import { Tag } from "@models/Tag";
import { firstValueFrom, Observable, of } from "rxjs";

@Injectable()
export class AnnotationService {
  public constructor(
    private tagsApi: TagsService,
    private audioRecordingsApi: AudioRecordingsService
  ) {}

  public async show(audioEvent: AudioEvent): Promise<Annotation> {
    const audioEventTags = await this.showTags(audioEvent);
    const audioRecording = await this.showAudioRecording(audioEvent);

    const data = {
      ...audioEvent,
      tags: audioEventTags,
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
    return await firstValueFrom(
      this.audioRecordingsApi.show(audioEvent.audioRecordingId)
    )
  }
}

interface ResolverNames {
  showOptional: string;
}

// we use a custom resolver here because the annotation service is a virtual
// service that does not have an api backing
// therefore, we cannot use the standard BawApiResolver here
class AnnotationResolver extends BawResolver<
  AnnotationSearchParameters,
  undefined,
  [],
  any,
  ResolverNames
> {
  public constructor() {
    super([ProjectsService, ShallowRegionsService, ShallowSitesService]);
  }

  public createProviders(
    name: string,
    resolver: Type<{
      resolve: ResolveFn<ResolvedModel<AnnotationSearchParameters>>;
    }>,
    deps: Type<ProjectsService | ShallowRegionsService | ShallowSitesService>[]
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
    const routeProjectId = route.params["projectId"];
    const routeRegionId = route.params["regionId"];
    const routeSiteId = route.params["siteId"];

    const data = {
      routeProjectId: routeProjectId,
      routeRegionId: routeRegionId,
      routeSiteId: routeSiteId,
      ...route.queryParams,
    };

    const parameterModel = new AnnotationSearchParameters(data);
    return of(parameterModel);
  }
}

export const annotationResolvers = new AnnotationResolver().create(
  "Annotations"
);
