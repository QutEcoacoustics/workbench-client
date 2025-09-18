import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  input,
  output,
  model
} from "@angular/core";
import { NgForm, FormsModule } from "@angular/forms";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { filterDate, filterTime } from "@helpers/filters/audioRecordingFilters";
import { filterModel } from "@helpers/filters/filters";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbDate, NgbCollapse, NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { FromJS, fromJS } from "immutable";
import { DateTime, Duration } from "luxon";
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
} from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { TimeComponent } from "../input/time/time.component";

export interface DateTimeFilterModel {
  projects?: Project[];
  regions?: Region[];
  sites?: Site[];
  dateFiltering?: boolean;
  dateStartedAfter?: NgbDate;
  dateFinishedBefore?: NgbDate;
  timeFiltering?: boolean;
  ignoreDaylightSavings?: boolean;
  timeStartedAfter?: Duration;
  timeFinishedBefore?: Duration;
}

@Component({
  selector: "baw-date-time-filter",
  templateUrl: "./date-time-filter.component.html",
  styleUrl: "./date-time-filter.component.scss",
  imports: [
    FormsModule,
    NgbCollapse,
    NgbInputDatepicker,
    FaIconComponent,
    TimeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeFilterComponent
  extends withUnsubscribe()
  implements AfterViewInit, AfterContentChecked
{
  public constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  @ViewChild(NgForm) public form: NgForm;
  public readonly project = input<Project>(undefined);
  public readonly region = input<Region>(undefined);
  public readonly site = input<Site>(undefined);
  @Input() public constructedFilters: BehaviorSubject<Filters<AudioRecording>>;

  public disableStartDate = input(false);
  public readonly disableEndDate = model(false);
  public readonly disableStartTime = model(false);
  public readonly disableEndTime = input(false);
  public readonly disableIgnoreDaylightSavings = input(false);

  public readonly modelChange = output<DateTimeFilterModel>();
  @Input() public model: DateTimeFilterModel = { ignoreDaylightSavings: true };

  private previousFilters: FromJS<Filters<AudioRecording>>;

  public ngAfterViewInit(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(defaultDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe)
      )
      .subscribe((dateModel: DateTimeFilterModel) => this.emitFilterUpdate(dateModel));
  }

  // TODO: Refactor the following hacky code block
  // without this code block, the ExpressionChangedAfterItHasBeenCheckedError warning is thrown in development mode
  public ngAfterContentChecked(): void {
    // since we are using angular form validation & bootstrap validation, the errors attribute of the form is updated with change detection
    // this causes the form state to update with change detection so we need to add an extra change detection cycle
    // to ensure the updated form state (with errors) is a part of the model at end of change detection
    this.changeDetector.detectChanges();
  }

  public emitFilterUpdate(dateModel: DateTimeFilterModel): void {
    // we should only send new filter requests when the user has not input any "bad" / incorrect values into the input fields
    // e.g. 2020-31-31 is not a valid date should display an error, and not send a new filter request
    if (!this.form.valid) {
      return;
    }

    const [changed, newFilters] = this.generateFilters(this.previousFilters, dateModel);

    if (changed) {
      // since this component can output a model, and/or a filter
      // we need to emit both the model and the filter if they are both present
      this.modelChange?.emit(dateModel);
      this.constructedFilters?.next(newFilters);
      this.previousFilters = fromJS(newFilters);
    }
  }

  private generateFilters(previousFilters: FromJS<Filters<AudioRecording>>, dateModel: DateTimeFilterModel): [boolean, Filters] {
    let newInnerFilters: InnerFilter<AudioRecording> = {};

    newInnerFilters = this.setModelFilters(newInnerFilters);
    newInnerFilters = this.setDateFilters(dateModel, newInnerFilters);
    newInnerFilters = this.setTimeOfDayFilters(dateModel, newInnerFilters);

    // if there are no filters, we should allow a filter event to be emitted with zero filter conditions
    // without this check, a filter with no conditions would have an inner filter of undefined rather than zero conditions
    const newFilters = Object.keys(newInnerFilters).length === 0 ? {} : { filter: newInnerFilters };

    // to prevent duplicate filters from being emitted, we compare the new filter to the previous filter's value
    // e.g. if a user types in a valid filter condition, inputs an invalid filter condition, then inputs a valid filter condition
    const changed = !fromJS(newFilters)?.equals(previousFilters) && newFilters !== previousFilters;

    if (Object.keys(newInnerFilters).length === 0) {
      return [changed, newFilters];
    }

    return [changed, newFilters];
  }

  private setModelFilters(filters: InnerFilter<AudioRecording>): InnerFilter<AudioRecording> {
    const site = this.site();
    const region = this.region();
    const project = this.project();
    if (site) {
      filters = filterModel<Site, AudioRecording>("sites", site, filters);
    } else if (region) {
      filters = filterModel<Region, AudioRecording>("regions", region, filters);
    } else if (project) {
      filters = filterModel<Project, AudioRecording>("projects", project, filters);
    }

    return filters;
  }

  private setDateFilters(dateModel: DateTimeFilterModel, filters: InnerFilter<AudioRecording>): InnerFilter<AudioRecording> {
    const modelStartDate = dateModel?.dateStartedAfter;
    const modelEndDate = dateModel?.dateFinishedBefore;

    // there will be no additional filters if the user hasn't input any dates. Therefore, we can bail out without calculating a date filter
    if (!dateModel?.dateFiltering || (!modelStartDate && !modelEndDate)) {
      return filters;
    }

    // using the Luxon DateTime object emits both the time and date. This prevents us from explicitly adding it later on
    const startDate =
      modelStartDate && DateTime.fromObject(modelStartDate, { zone: "utc" });
    const endDate =
      modelEndDate && DateTime.fromObject(modelEndDate, { zone: "utc" });

    return filterDate(filters, startDate, endDate);
  }

  private setTimeOfDayFilters(dateModel: DateTimeFilterModel, filters: InnerFilter<AudioRecording>): InnerFilter<AudioRecording> {
    const modelStartTime = dateModel?.timeStartedAfter;
    const modelEndTime = dateModel?.timeFinishedBefore;

    // we can save ourselves from calculating a new time filters (improving performance) if the user hasn't input a start time or end time
    if (!dateModel?.timeFiltering || (!modelStartTime && !modelEndTime)) {
      return filters;
    }

    return filterTime(
      filters,
      dateModel.ignoreDaylightSavings,
      modelStartTime,
      modelEndTime
    );
  }
}
