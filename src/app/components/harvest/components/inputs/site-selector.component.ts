import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { SitesService } from "@baw-api/site/sites.service";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Id } from "@interfaces/apiInterfaces";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import {
  NgbTypeahead,
  NgbTypeaheadSelectItemEvent,
} from "@ng-bootstrap/ng-bootstrap";
import { ConfigService } from "@services/config/config.service";
import { is } from "immutable";
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
  selector: "baw-harvest-site-selector",
  template: `
    <!-- Show site name and link if exists -->
    <div *ngIf="site && !isEditing" class="site-label">
      <a [bawUrl]="site.getViewUrl(project)">{{ site.name }}</a>
      <baw-harvest-edit-item (click)="isEditing = true"></baw-harvest-edit-item>
    </div>

    <div *ngIf="!site && inheritedSite && !isEditing" class="site-label">
      <span class="text-muted">{{ inheritedSite.name }}</span>
      <baw-harvest-edit-item (click)="isEditing = true"></baw-harvest-edit-item>
    </div>

    <!-- Show user input if no site -->
    <div [class.d-none]="!isEditing" class="input-group input-group-sm">
      <input
        #selector="ngbTypeahead"
        id="selector"
        type="text"
        class="form-select"
        [placeholder]="inputPlaceholder"
        [ngbTypeahead]="search$"
        [resultFormatter]="formatter"
        [editable]="false"
        [(ngModel)]="site"
        (focus)="focus$.next($any($event).target.value)"
        (selectItem)="onSelectItem($event)"
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
      }
    `,
  ],
})
export class SiteSelectorComponent extends withUnsubscribe() implements OnInit, OnChanges {
  @ViewChild("selector", { static: true }) public selector: NgbTypeahead;
  @Input() public project: Project;
  @Input() public site: Site | null;
  @Input() public inheritedSite: Site | null;
  @Output() public siteIdChange = new EventEmitter<Id | null>();

  public focus$ = new Subject<Site>();
  public click$ = new Subject<Site>();
  public search$: OperatorFunction<string, readonly Site[]>;

  public prevValue: Site;
  public emptyText = "Same as Parent";

  public isEditing = false;

  public constructor(
    private config: ConfigService,
    private sitesApi: SitesService
  ) {
    super();
  }

  public ngOnChanges({inheritedSite}: SimpleChanges): void {
    if (this.site) {
      return;
    }
    if (!inheritedSite.previousValue && inheritedSite.currentValue) {
      this.isEditing = false;
    } else if (inheritedSite.previousValue && !inheritedSite.currentValue) {
      this.isEditing = true;
    }
  }

  public ngOnInit(): void {
    this.isEditing = (!this.site && !this.inheritedSite)

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

  // public get inputPlaceholder(): string {
  //   if (this.prevValue) {
  //     return this.prevValue.name;
  //   }
  //   return this.config.settings.hideProjects ? "Point" : "Site";
  // }

  public get inputPlaceholder(): string {
    //const siteType = this.config.settings.hideProjects ? "Point" : "Site";
    return "Select site"
  }

  public get editTooltip(): string {
    const modelName = this.config.settings.hideProjects ? "point" : "site";
    return `Change the ${modelName} associated with this folder path`;
  }

  public formatter(site: Site): string {
    return site.name;
  }

  public emitSite(site: Site): void {
    this.siteIdChange.emit(site?.id ?? null);
  }

  public onSelectItem(item: NgbTypeaheadSelectItemEvent<Site>): void {
    console.log("onSelectItem", item);
    this.site = item.item;
    this.emitSite(this.site);
    this.isEditing = false;
  }

  public resetSite(): void {
    this.prevValue = this.site;
    this.site = null;
    this.emitSite(this.site);
  }
}
