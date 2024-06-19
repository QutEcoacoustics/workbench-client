import { Component, Input, OnChanges } from "@angular/core";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { Filters } from "@baw-api/baw-api.service";
import { AudioEvent } from "@models/AudioEvent";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { DateTimeFilterModel } from "@shared/date-time-filter/date-time-filter.component";
import { Observable, of } from "rxjs";

@Component({
  selector: "baw-annotation-search-preview",
  templateUrl: "annotation-search-preview.component.html",
  styleUrl: "annotation-search-preview.component.scss",
})
export class AnnotationSearchPreviewComponent implements OnChanges {
  public constructor(private audioEventsApi: ShallowAudioEventsService) {}

  @Input({ required: true })
  public project: Project;

  @Input({ required: true })
  public regions: Region[];

  @Input({ required: true })
  public sites: Site[];

  @Input({ required: true })
  public tags: Tag[];

  @Input({ required: true })
  public dateFilters: DateTimeFilterModel;

  @Input({ required: true })
  public onlyUnverified: boolean;

  protected audioEvents: Observable<AudioEvent[]> = of();

  public ngOnChanges(): void {
    const filters = this.buildFilter(
      this.project,
      this.regions,
      this.sites,
      this.tags,
      this.dateFilters
    );

    this.audioEvents = this.audioEventsApi.filter(filters)
  }

  protected buildAudioUrl(audioEvent: AudioEvent): string {
    const basePath = `https://api.staging.ecosounds.org/audio_recordings/${audioEvent.audioRecordingId}/original`;
    const urlParams = `?end_offset=${audioEvent.endTimeSeconds}&start_offset=${audioEvent.startTimeSeconds}`;
    return basePath + urlParams;
  }

  private buildFilter(
    project: Project,
    regions: Region[],
    sites: Site[],
    tags: Tag[],
    dateFilters: DateTimeFilterModel
  ): Filters<AudioEvent> {
    return {
      filter: {
        isReference: {
          eq: true,
        },
        "tags.id": {
          in: tags.map((tag) => tag.id),
        },
        "projects.id": {
          eq: project.id,
        },
        "regions.id": {
          in: regions.map((region) => region.id),
        },
        "sites.id": {
          in: sites.map((site) => site.id),
        },
      }
    } as Filters<AudioEvent>;
  }
}
