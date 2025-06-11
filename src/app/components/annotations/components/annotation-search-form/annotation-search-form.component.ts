import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
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
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import {
  NgbDate,
  NgbCollapse,
  NgbHighlight,
  NgbTooltip,
} from "@ng-bootstrap/ng-bootstrap";
import {
  DateTimeFilterModel,
  DateTimeFilterComponent,
} from "@shared/date-time-filter/date-time-filter.component";
import {
  createIdSearchCallback,
  createSearchCallback,
} from "@helpers/typeahead/typeaheadCallbacks";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { DateTime } from "luxon";
import { FormsModule } from "@angular/forms";
import { WIPComponent } from "@shared/wip/wip.component";
import { filterModel } from "@helpers/filters/filters";
import { InnerFilter } from "@baw-api/baw-api.service";
import { Writeable } from "@helpers/advancedTypes";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { toNumber } from "@helpers/typing/toNumber";

enum ScoreRangeBounds {
  Lower,
  Upper,
}

@Component({
  selector: "baw-annotation-search-form",
  templateUrl: "./annotation-search-form.component.html",
  styleUrl: "./annotation-search-form.component.scss",
  imports: [
    FormsModule,
    DateTimeFilterComponent,
    TypeaheadInputComponent,
    WIPComponent,
    DebouncedInputDirective,
    NgbCollapse,
    NgbHighlight,
    NgbTooltip,
  ],
})
export class AnnotationSearchFormComponent implements OnInit {
  public constructor(
    protected recordingsApi: AudioRecordingsService,
    protected audioEventsApi: AudioEventsService,
    protected projectsApi: ProjectsService,
    protected regionsApi: ShallowRegionsService,
    protected sitesApi: ShallowSitesService,
    protected tagsApi: TagsService,
  ) {}

  @Input({ required: true })
  public searchParameters: AnnotationSearchParameters;
  @Output()
  public searchParametersChange =
    new EventEmitter<AnnotationSearchParameters>();

  @ViewChild("recordingsTypeahead")
  private recordingsTypeahead: TypeaheadInputComponent<AudioRecording>;

  protected recordingDateTimeFilters: DateTimeFilterModel = {};
  protected createSearchCallback = createSearchCallback;
  protected createIdSearchCallback = createIdSearchCallback;
  protected hideAdvancedFilters = true;
  protected scoreRangeBounds = ScoreRangeBounds;
  protected scoreRangeError = signal<string | null>(null);

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

    // we want to set the initial model the date/time filters
    // TODO: this should probably be moved to a different spot
    const hasDateFilters = this.searchParameters.recordingDate?.length > 0;
    if (hasDateFilters) {
      const dateFinishedBefore = new NgbDate(
        this.searchParameters.recordingDateFinishedBefore.year,
        this.searchParameters.recordingDateFinishedBefore.month,
        this.searchParameters.recordingDateFinishedBefore.day,
      );

      this.recordingDateTimeFilters = {
        dateFiltering: true,
        dateFinishedBefore,
      };
    }
  }

  /**
   * Creates a filter condition to fetch models scoped to the current route
   * models.
   * This can be used in the typeaheads where you need to provide search
   * results for site, regions, etc... under a parent model (e.g. project).
   */
  protected routeModelFilters(): InnerFilter<Project | Region | Site> {
    if (this.site) {
      return filterModel("sites", this.site);
    } else if (this.region) {
      return filterModel("regions", this.region);
    } else if (this.project) {
      return filterModel("projects", this.project);
    }

    // When an empty object is returned, annotations will not be filtered to a
    // route model, meaning that all annotations will be returned regardless of
    // project/region/site affinity.
    // E.g. On the library page, we want to initially view all annotations
    // regardless of what project/region/site they belong to.
    return {};
  }

  protected toggleAdvancedFilters(): void {
    this.hideAdvancedFilters = !this.hideAdvancedFilters;

    if (this.hideAdvancedFilters) {
      this.searchParameters.audioRecordings = null;
    } else {
      const recordingIds = this.recordingsTypeahead.value.map(
        (model: AudioRecording) => model.id,
      );

      if (recordingIds.length > 0) {
        this.searchParameters.audioRecordings = recordingIds;
      }
    }

    this.searchParametersChange.emit(this.searchParameters);
  }

  protected updateSubModel(
    key: keyof AnnotationSearchParameters,
    subModels: any[],
  ): void {
    // if the subModels array is empty, the user has not selected any models
    // we should set the search parameter to null so that it is not emitted
    if (subModels.length === 0) {
      this.searchParameters[key as any] = null;
      this.searchParametersChange.emit(this.searchParameters);
      return;
    }

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

    if (!dateTimeModel.dateFiltering) {
      this.searchParameters.recordingDate = null;
    }
    if (!dateTimeModel.timeFiltering) {
      this.searchParameters.recordingTime = null;
    }

    this.searchParametersChange.emit(this.searchParameters);
  }

  protected updateScoreRange(
    textValue: string,
    boundPosition: ScoreRangeBounds,
  ) {
    const value = toNumber(textValue);

    // While not a valid number, an empty text input is a valid value because
    // the user is trying to remove their filter.
    // In this case, we should pass through the null value so that score is
    // removed from the parameter model / query string parameters.
    if (value === null && textValue !== "") {
      this.scoreRangeError.set("Score must be a number.");
      return;
    }

    const arrayIndex = boundPosition === ScoreRangeBounds.Lower ? 0 : 1;
    const currentScore = this.searchParameters.score ?? [null, null];
    currentScore[arrayIndex] = value;

    this.searchParameters.score = currentScore;

    if (
      this.searchParameters.scoreLowerBound >
      this.searchParameters.scoreUpperBound
    ) {
      this.scoreRangeError.set("Score lower bound must be less than or equal to the score upper bound.");
    } else {
      this.scoreRangeError.set(null);
    }

    this.searchParametersChange.emit(this.searchParameters);
  }

  protected updateParameterProperty<
    T extends keyof Writeable<AnnotationSearchParameters>,
  >(key: T, value: AnnotationSearchParameters[T]) {
    this.searchParameters[key] = value;
    this.searchParametersChange.emit(this.searchParameters);
  }

  protected updateSortBy(event: Event): void {
    // We use a type guard here because event.target is typed as a HTMLElement
    // which does not have the "value" property.
    // By type narrowing the target to a HTMLSelectElement, we can ensure that
    // the "value" property is defined.
    //
    // Note that this condition should never trigger, and because this method
    // should always be called from a select element event listener, so this
    // type guard is purely for correctness and type narrowing.
    // Additionally, JIT should be able to optimize away this guard before the
    // method is ever called.
    if (!(event.target instanceof HTMLSelectElement)) {
      console.warn("Attempted to update sort key through non-select element");
      return;
    }

    this.searchParametersChange.emit(this.searchParameters);
  }
}
