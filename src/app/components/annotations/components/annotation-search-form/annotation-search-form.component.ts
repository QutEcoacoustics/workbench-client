import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { AudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import {
  DateTimeFilterComponent,
  DateTimeFilterModel,
} from "@shared/date-time-filter/date-time-filter.component";
import { createSearchCallback } from "@shared/typeahead-input/typeahead-callbacks";
import { DateTime } from "luxon";

@Component({
  selector: "baw-annotation-search-form",
  templateUrl: "annotation-search-form.component.html",
  styleUrl: "annotation-search-form.component.scss",
})
export class AnnotationSearchFormComponent implements OnInit, AfterViewInit {
  public constructor(
    protected recordingsApi: AudioRecordingsService,
    protected audioEventsApi: AudioEventsService,
    protected projectsApi: ProjectsService,
    protected regionsApi: ShallowRegionsService,
    protected sitesApi: ShallowSitesService,
    protected tagsApi: TagsService
  ) {}

  @Input({ required: true })
  public searchParameters: AnnotationSearchParameters;
  @Output()
  public searchParametersChange =
    new EventEmitter<AnnotationSearchParameters>();

  @ViewChild("dateTimeFiltersElement")
  private dateTimeFilters: ElementRef<DateTimeFilterComponent>;

  protected hideAdvancedFilters = true;
  protected createSearchCallback = createSearchCallback;

  protected get project(): Project {
    return this.searchParameters.routeProjectModel;
  }

  protected get region(): Region {
    return this.searchParameters.routeRegionModel;
  }

  protected get site(): Site {
    return this.searchParameters.routeSiteModel;
  }

  public ngOnInit(): void {
    // if there are advanced filters when we initially load the page, we should
    // automatically open the advanced filters accordion so that the user can
    // see that advanced filters are applied
    const advancedFilterKeys: (keyof AnnotationSearchParameters)[] = [
      "audioRecordings",
    ];

    for (const key of advancedFilterKeys) {
      const value = this.searchParameters[key];

      if (Array.isArray(value) && value.length > 0) {
        this.hideAdvancedFilters = false;
        break;
      } else if (isInstantiated(value)) {
        this.hideAdvancedFilters = false;
        break;
      }
    }
  }

  public ngAfterViewInit(): void {
    // we want to set the initial model the date/time filters
    // TODO: this should probably be moved to a different spot
    const hasDateFilters = this.searchParameters.recordingDate?.length > 0;
    if (hasDateFilters) {
      const dateFinishedBefore = new NgbDate(
        this.searchParameters.recordingDateFinishedBefore.year,
        this.searchParameters.recordingDateFinishedBefore.month,
        this.searchParameters.recordingDateFinishedBefore.day
      );

      this.dateTimeFilters.nativeElement.value = {
        dateFiltering: true,
        dateFinishedBefore,
      };
    }
  }

  protected updateSubModel(
    key: keyof AnnotationSearchParameters,
    subModels: any[]
  ): void {
    const ids = subModels.map((model) => model.id);
    this.searchParameters[key as any] = ids;
    this.searchParametersChange.emit(this.searchParameters);
  }

  protected updateRecordingDateTime(dateTimeModel: DateTimeFilterModel): void {
    if (dateTimeModel.dateStartedAfter || dateTimeModel.dateFinishedBefore) {
      this.searchParameters.recordingDate = [
        dateTimeModel.dateStartedAfter
          ? DateTime.fromObject(dateTimeModel.dateStartedAfter)
          : null,
        dateTimeModel.dateFinishedBefore
          ? DateTime.fromObject(dateTimeModel.dateFinishedBefore)
          : null,
      ];
    }

    if (dateTimeModel.timeStartedAfter || dateTimeModel.timeFinishedBefore) {
      this.searchParameters.recordingTime = [
        dateTimeModel.timeStartedAfter,
        dateTimeModel.timeFinishedBefore,
      ];
    }

    this.searchParametersChange.emit(this.searchParameters);
  }

  protected updateOnlyUnverified(value: boolean): void {
    this.searchParameters.onlyUnverified = value;
    this.searchParametersChange.emit(this.searchParameters);
  }
}
