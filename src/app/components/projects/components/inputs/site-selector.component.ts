import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { ConfigService } from "@services/config/config.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  merge,
  Observable,
  OperatorFunction,
  Subject,
  switchMap,
} from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";

@Component({
  selector: "baw-site-selector",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SiteSelectorComponent,
    },
  ],
  template: `
    <div *ngIf="value" class="site-label">
      <a [bawUrl]="value.getViewUrl(project)">{{ value.name }}</a>

      <div>
        <button
          type="button"
          class="btn btn-sm p-0 me-1"
          [ngbTooltip]="editTooltip"
          (click)="resetSite()"
        >
          <fa-icon [icon]="['fas', 'pen-to-square']"></fa-icon>
        </button>
      </div>
    </div>
    <div [class.d-none]="value" class="input-group input-group-sm">
      <input
        #selector="ngbTypeahead"
        id="selector"
        type="text"
        class="form-select"
        [placeholder]="inputPlaceholder"
        [ngbTypeahead]="search$"
        [resultFormatter]="formatter"
        [editable]="false"
        [(ngModel)]="value"
        (focus)="focus$.next($any($event).target.value)"
        (click)="onSelection($any($event).target.value)"
        (blur)="onTouched()"
        (selectItem)="updateChanges()"
      />
    </div>
  `,
  styles: [
    `
      .site-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .site-label,
      .input-group {
        width: 100%;
        min-width: 170px;
      }
    `,
  ],
})
export class SiteSelectorComponent implements OnInit, ControlValueAccessor {
  @ViewChild("selector", { static: true }) public selector: NgbTypeahead;
  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public site: Site;

  public focus$ = new Subject<Site>();
  public click$ = new Subject<Site>();
  public search$: OperatorFunction<string, readonly Site[]>;

  public prevValue: Site;

  /** Current value */
  public value: Site;
  /** Has value been set */
  public dirty: boolean;
  /** Has input been touched */
  public touched: boolean;

  public constructor(
    private config: ConfigService,
    private sitesApi: SitesService
  ) {}

  /** Invoked when the model has been changed */
  public onChange: (_: Site) => void = () => {};

  /** Invoked when the model has been touched */
  public onTouched: () => void = () => {};

  /** Method that is invoked on an update of a model. */
  public updateChanges = () => this.onChange(this.value);

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   *
   * @param fn
   */
  public registerOnChange = (fn: any): void => (this.onChange = fn);

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   *
   * @param fn
   */
  public registerOnTouched = (fn: any): void => (this.onTouched = fn);

  /**
   * Method that is invoked when the control status changes to or from "DISABLED".
   */
  public setDisabledState = (_: boolean) => {};

  public writeValue(value: Site): void {
    this.value = value;
    this.updateChanges();
  }

  public ngOnInit(): void {
    this.search$ = (text$: Observable<string>): Observable<Site[]> => {
      const debouncedText$ = text$.pipe(
        debounceTime(defaultDebounceTime),
        distinctUntilChanged()
      );
      const clicksWithClosedPopup$ = this.click$.pipe(
        filter(() => !this.selector.isPopupOpen())
      );
      const inputFocus$ = this.focus$;

      return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
        switchMap((site: Site | string) =>
          this.sitesApi.filter(
            {
              paging: { items: 10 },
              filter: {
                name: {
                  contains: (site as Site)?.name ?? (site as string) ?? "",
                },
              },
            },
            this.project
          )
        )
      );
    };

    this.value = this.site;
  }

  public get inputPlaceholder(): string {
    if (this.prevValue) {
      return this.prevValue.name;
    }
    return this.config.settings.hideProjects ? "Point" : "Site";
  }

  public get editTooltip(): string {
    const modelName = this.config.settings.hideProjects ? "point" : "site";
    return `Change the ${modelName} associated with this folder path`;
  }

  public formatter(site: Site): string {
    return site.name;
  }

  public resetSite(): void {
    this.prevValue = this.value;
    this.value = undefined;
    this.updateChanges();
  }

  public onSelection(site: Site): void {
    this.click$.next(site);
  }
}
