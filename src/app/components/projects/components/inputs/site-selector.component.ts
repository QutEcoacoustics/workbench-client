import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { SitesService } from "@baw-api/site/sites.service";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Id } from "@interfaces/apiInterfaces";
import { Project } from "@models/Project";
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
  template: `
    <!-- Show site name and link if exists -->
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

    <!-- Show user input if no site -->
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
        (selectItem)="emitSite()"
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
export class SiteSelectorComponent extends withUnsubscribe() implements OnInit {
  @ViewChild("selector", { static: true }) public selector: NgbTypeahead;
  @Input() public project: Project;
  @Input() public site: Site | null;
  @Output() public siteIdChange = new EventEmitter<Id>();

  public focus$ = new Subject<Site>();
  public click$ = new Subject<Site>();
  public search$: OperatorFunction<string, readonly Site[]>;

  public prevValue: Site;
  public value: Site;

  public constructor(
    private config: ConfigService,
    private sitesApi: SitesService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.value = this.site;

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

  public emitSite(): void {
    this.siteIdChange.emit(this.value?.id ?? undefined);
  }

  public resetSite(): void {
    this.prevValue = this.value;
    this.value = undefined;
  }

  public onSelection(site: Site): void {
    this.click$.next(site);
  }
}
