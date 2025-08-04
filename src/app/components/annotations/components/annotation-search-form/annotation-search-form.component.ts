import { Component, computed, model, OnInit, output, signal, viewChild } from "@angular/core";
import { AudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import {
  AnnotationSearchParameters,
  VerificationStatusKey,
} from "@components/annotations/pages/annotationSearchParameters";
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
import { filterModel } from "@helpers/filters/filters";
import { InnerFilter } from "@baw-api/baw-api.service";
import { Writeable } from "@helpers/advancedTypes";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { toNumber } from "@helpers/typing/toNumber";
import { BawSessionService } from "@baw-api/baw-session.service";
import {
  ISelectableItem,
  SelectableItemsComponent,
} from "@shared/items/selectable-items/selectable-items.component";
import { CheckboxComponent } from "@shared/checkbox/checkbox.component";
import { Tag } from "@models/Tag";

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
    DebouncedInputDirective,
    SelectableItemsComponent,
    NgbCollapse,
    NgbHighlight,
    NgbTooltip,
    FormsModule,
    CheckboxComponent,
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
    protected session: BawSessionService,
  ) {
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.session.authTrigger.subscribe(() => {
      this.verifiedStatusOptions.update((current) => {
        current[0].disabled = !this.session.isLoggedIn;
        return current;
      });
    });
  }

  public searchParameters = model.required<AnnotationSearchParameters>();
  public searchParametersChange = output<AnnotationSearchParameters>();

  private recordingsTypeahead = viewChild<
    TypeaheadInputComponent<AudioRecording>
  >("recordingsTypeahead");

  protected recordingDateTimeFilters = signal<DateTimeFilterModel>({});
  protected createSearchCallback = createSearchCallback;
  protected createIdSearchCallback = createIdSearchCallback;
  protected hideAdvancedFilters = signal(true);

  protected scoreRangeBounds = ScoreRangeBounds;
  protected verifiedStatusOptions = signal<ISelectableItem<VerificationStatusKey>[]>([
    {
      label: "have not been verified by me",
      value: "unverified-for-me",
      disabled: true,
    },
    { label: "have not been verified by anyone", value: "unverified" },
    { label: "are verified or unverified", value: "any" },
  ]);

  protected project = computed(() => this.searchParameters().routeProjectModel);
  protected region = computed(() => this.searchParameters().routeRegionModel);
  protected site = computed(() => this.searchParameters().routeSiteModel);

  protected get defaultVerificationStatus(): VerificationStatusKey {
    return this.session.isLoggedIn ? "unverified-for-me" : "unverified";
  }

  public ngOnInit(): void {
    // if there are advanced filters when we initially load the page, we should
    // automatically open the advanced filters accordion so that the user can
    // see that advanced filters are applied
    const advancedFilterKeys: (keyof AnnotationSearchParameters)[] = [
      "audioRecordings",
    ];

    for (const key of advancedFilterKeys) {
      const value = this.searchParameters()[key];

      if (Array.isArray(value) && value.length > 0) {
        this.hideAdvancedFilters.set(false);
        break;
      } else if (isInstantiated(value)) {
        this.hideAdvancedFilters.set(false);
        break;
      }
    }

    // we want to set the initial model the date/time filters
    // TODO: this should probably be moved to a different spot
    const hasDateFilters = this.searchParameters().recordingDate?.length > 0;
    if (hasDateFilters) {
      const dateFinishedBefore = new NgbDate(
        this.searchParameters().recordingDateFinishedBefore.year,
        this.searchParameters().recordingDateFinishedBefore.month,
        this.searchParameters().recordingDateFinishedBefore.day,
      );

      this.recordingDateTimeFilters.set({
        dateFiltering: true,
        dateFinishedBefore,
      });
    }
  }

  protected tagTaskSearchCallback() {
    const tagIds = this.searchParameters().tags ?? [];
    const filters: InnerFilter<Tag> = {
      "id": { in: Array.from(tagIds) },
    };

    return createSearchCallback(this.tagsApi, "text", filters);
  }

  /**
   * Creates a filter condition to fetch models scoped to the current route
   * models.
   * This can be used in the typeahead's where you need to provide search
   * results for site, regions, etc... under a parent model (e.g. project).
   */
  protected routeModelFilters(): InnerFilter<Project | Region | Site> {
    if (this.site()) {
      return filterModel("sites", this.site());
    } else if (this.region()) {
      return filterModel("regions", this.region());
    } else if (this.project()) {
      return filterModel("projects", this.project());
    }

    // When an empty object is returned, annotations will not be filtered to a
    // route model, meaning that all annotations will be returned regardless of
    // project/region/site affinity.
    // E.g. On the library page, we want to initially view all annotations
    // regardless of what project/region/site they belong to.
    return {};
  }

  protected toggleAdvancedFilters(): void {
    this.hideAdvancedFilters.update((current) => !current);

    if (this.hideAdvancedFilters()) {
      this.searchParameters.update((current) => {
        current.audioRecordings = null;
        return current;
      });
    } else {
      const recordingIds = this.recordingsTypeahead().value.map(
        (recordingModel: AudioRecording) => recordingModel.id,
      );

      if (recordingIds.length > 0) {
        this.searchParameters.update((current) => {
          current.audioRecordings = recordingIds;
          return current;
        });
      }
    }

    this.emitUpdate();
  }

  protected updateSubModel(
    key: keyof AnnotationSearchParameters,
    subModels: any[],
  ): void {
    // if the subModels array is empty, the user has not selected any models
    // we should set the search parameter to null so that it is not emitted
    if (subModels.length === 0) {
      this.searchParameters.update((current) => {
        current[key as any] = null;
        return current;
      });
      return;
    }

    const ids = subModels.map((subModel) => subModel.id);
    this.searchParameters.update((current) => {
      current[key as any] = ids;
      return current;
    });

    this.emitUpdate();
  }

  protected updateRecordingDateTime(dateTimeModel: DateTimeFilterModel): void {
    if (dateTimeModel.dateStartedAfter || dateTimeModel.dateFinishedBefore) {
      this.searchParameters.update((current) => {
        current.recordingDate = [
          dateTimeModel.dateStartedAfter
            ? DateTime.fromObject(dateTimeModel.dateStartedAfter)
            : null,
          dateTimeModel.dateFinishedBefore
            ? DateTime.fromObject(dateTimeModel.dateFinishedBefore)
            : null,
        ];
        return current;
      });
    }

    if (dateTimeModel.timeStartedAfter || dateTimeModel.timeFinishedBefore) {
      this.searchParameters.update((current) => {
        current.recordingTime = [
          dateTimeModel.timeStartedAfter,
          dateTimeModel.timeFinishedBefore,
        ];
        return current;
      });
    }

    if (!dateTimeModel.dateFiltering) {
      this.searchParameters.update((current) => {
        current.recordingDate = null;
        return current;
      })
    }

    if (!dateTimeModel.timeFiltering) {
      this.searchParameters.update((current) => {
        current.recordingTime = null;
        return current;
      })
    }

    this.emitUpdate();
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
      return;
    }

    const arrayIndex = boundPosition === ScoreRangeBounds.Lower ? 0 : 1;
    const currentScore = this.searchParameters().score ?? [null, null];
    currentScore[arrayIndex] = value;

    this.searchParameters.update((current) => {
      current.score = currentScore;
      return current;
    })

    this.emitUpdate();
  }

  protected updateParameterProperty<
    T extends keyof Writeable<AnnotationSearchParameters>,
  >(key: T, value: AnnotationSearchParameters[T]) {
    this.searchParameters.update((current) => {
      current[key] = value;
      return current
    })

    this.emitUpdate();
  }

  protected defaultSelectOption(): VerificationStatusKey {
    return this.session.isLoggedIn ? "unverified-for-me" : "unverified";
  }

  private emitUpdate() {
    this.searchParametersChange.emit(this.searchParameters());
  }
}
