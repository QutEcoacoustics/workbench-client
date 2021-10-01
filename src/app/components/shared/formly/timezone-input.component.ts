import { Component, OnInit, ViewChild } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { FieldType } from "@ngx-formly/core";
import { getTimeZones, TimeZone } from "@vvo/tzdb";
import { merge, Observable, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from "rxjs/operators";
import { asFormControl } from "./helper";

/**
 * Timezone Input
 */
@Component({
  selector: "baw-timezone-input",
  template: `
    <div class="form-group">
      <label *ngIf="to.label" [for]="field.id">
        {{ to.label + (to.required ? " *" : "") }}
      </label>

      <ng-template #resultTemplate let-r="result" let-t="term">
        <ngb-highlight
          [result]="r.currentTimeFormat"
          [term]="t"
        ></ngb-highlight>
      </ng-template>

      <div class="input-group">
        <input
          #instance="ngbTypeahead"
          [id]="field.id + 'tz-selector'"
          type="text"
          class="form-control"
          placeholder="Type a city or country name."
          [class]="{ 'is-invalid': error }"
          [editable]="false"
          [ngbTypeahead]="search"
          [inputFormatter]="formatter"
          [resultTemplate]="resultTemplate"
          [formlyAttributes]="field"
          [(ngModel)]="timezone"
          (ngModelChange)="updateValue()"
          (focus)="focus$.next($any($event).target.value)"
          (click)="click$.next($any($event).target.value)"
        />

        <div class="input-group-append">
          <span class="input-group-text">
            <ng-container *ngIf="timezone; else invalidTimezone">
              {{ timezone.countryName || timezone.abbreviation }}
            </ng-container>
            <ng-template #invalidTimezone>
              <fa-icon [icon]="invalidIcon" [style.color]="'red'"></fa-icon>
            </ng-template>
          </span>
        </div>
      </div>

      <div class="invalid-feedback" style="display: block;">
        {{ error }}
      </div>

      <input
        type="hidden"
        [id]="field.id"
        [formControl]="asFormControl(formControl)"
      />
    </div>
  `,
})
export class TimezoneInputComponent extends FieldType implements OnInit {
  @ViewChild("instance", { static: true }) public instance: NgbTypeahead;

  public asFormControl = asFormControl;
  public click$ = new Subject<string>();
  public focus$ = new Subject<string>();
  public invalidIcon: IconProp = faBan;
  public timezone: TimeZone;
  public timezones: TimeZone[] = [];

  public ngOnInit() {
    this.timezones = getTimeZones({ includeUtc: true });
    this.setDefaultValue();
  }

  public get error(): string {
    const err = this.formControl.getError(this.field.key.toString());
    if (err) {
      return;
    }

    if (this.to.required && !this.timezone && this.formControl.dirty) {
      return "Timezone must be selected from dropdown menu";
    }
  }

  /**
   * Update form controller with latest timezone value
   */
  public updateValue() {
    this.formControl.setValue(this.timezone?.name);
  }

  /**
   * Format typeahead output to show current time format of timezone
   *
   * @param selected Selected timezone
   */
  public formatter = (selected: TimeZone): string => selected.currentTimeFormat;

  /**
   * Update typeahead dropdown list whenever event is detected
   *
   * @param text$ Search event
   */
  public search = (text$: Observable<string>): Observable<TimeZone[]> => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) => this.searchTimezones(term))
    );
  };

  /**
   * Set the default timezone value
   */
  private setDefaultValue() {
    const key = this.field.key as string;
    const defaultValue = this.model[key];

    if (isInstantiated(defaultValue)) {
      // Find all matching timezones, and select the first match
      const tzs = this.searchTimezones(defaultValue, "name");
      if (tzs.length > 0) {
        this.timezone = tzs[0];
        this.updateValue();
      }
    }
  }

  /**
   * Search timezones and select any which reference the input
   *
   * @param term Term to search for
   */
  private searchTimezones(
    term: string,
    timezoneKey: keyof TimeZone = "currentTimeFormat"
  ): TimeZone[] {
    let zones = this.timezones;

    if (term?.length > 0) {
      zones = zones.filter((zone) =>
        (zone[timezoneKey] as string)
          .toLocaleLowerCase()
          .includes(term.toLocaleLowerCase())
      );
    }

    return zones.slice(0, 10);
  }
}
