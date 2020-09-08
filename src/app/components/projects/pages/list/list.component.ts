import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { InnerFilter } from "@baw-api/baw-api.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem,
} from "@components/projects/projects.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IProject } from "@models/Project";
import { Card } from "@shared/cards/cards.component";
import { List } from "immutable";
import { noop, Subject } from "rxjs";
import { debounceTime, map, mergeMap, takeUntil } from "rxjs/operators";

export const projectsMenuItemActions = [
  newProjectMenuItem,
  requestProjectMenuItem,
];

@Component({
  selector: "app-projects-list",
  template: `
    <baw-filter
      placeholder="Filter Projects"
      (filter)="onFilter($event)"
    ></baw-filter>

    <!-- Display project cards -->
    <div
      class="search-results"
      infiniteScroll
      [infiniteScrollDistance]="2"
      [infiniteScrollThrottle]="50"
      (scrolled)="onScroll()"
    >
      <!-- Projects Exist -->
      <ng-container *ngIf="cardList.size > 0">
        <baw-cards [cards]="cardList"></baw-cards>
      </ng-container>

      <!-- Projects Don't Exist -->
      <ng-template *ngIf="cardList.size === 0 && !loading">
        <h4 class="text-center">Your list of projects is empty</h4>
      </ng-template>
    </div>

    <!-- Loading Projects -->
    <baw-loading [display]="loading"></baw-loading>
  `,
})
class ListComponent extends PageComponent implements OnInit {
  public cardList: List<Card> = List([]);
  public loading: boolean;
  private page = 1;
  private filter: InnerFilter<IProject>;
  private projects$ = new Subject<void>();
  private filter$ = new Subject<void>();

  constructor(private api: ProjectsService) {
    super();
  }

  public ngOnInit() {
    const errorHandler = (error) => {
      console.error(error);
      this.loading = false;
    };

    this.projects$
      .pipe(
        mergeMap(() => this.getProjects()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(noop, errorHandler);

    this.filter$
      .pipe(
        debounceTime(500),
        map(() => {
          this.cardList = List([]);
          this.page = 1;
        }),
        mergeMap(() => this.getProjects()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(noop, errorHandler);

    this.projects$.next();
  }

  public onScroll() {
    this.page++;
    this.projects$.next();
  }

  public onFilter(input: string) {
    this.page = 1;
    this.filter = input ? { name: { contains: input } } : undefined;
    this.filter$.next();
  }

  private getProjects() {
    this.loading = true;
    return this.api
      .filter({
        paging: { page: this.page },
        filter: this.filter,
      })
      .pipe(
        map((projects) => {
          this.cardList = this.cardList.push(
            ...projects.map((project) => project.getCard())
          );
          this.loading = false;
        })
      );
  }
}

ListComponent.LinkComponentToPageInfo({
  category: projectsCategory,
}).AndMenuRoute(projectsMenuItem);

export { ListComponent };
