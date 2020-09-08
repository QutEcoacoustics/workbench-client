import { Component, OnInit } from "@angular/core";
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
import { map, mergeMap, takeUntil } from "rxjs/operators";

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
      [infiniteScrollDisabled]="disableScroll"
      (scrolled)="onScroll()"
    >
      <!-- Projects Exist -->
      <ng-container *ngIf="cardList.size > 0">
        <baw-cards [cards]="cardList"></baw-cards>
      </ng-container>

      <!-- Projects Don't Exist -->
      <ng-container *ngIf="cardList.size === 0 && !loading">
        <h4 class="text-center">Your list of projects is empty</h4>
      </ng-container>
    </div>

    <!-- Loading Projects -->
    <baw-loading [display]="loading"></baw-loading>
  `,
})
class ListComponent extends PageComponent implements OnInit {
  public cardList: List<Card> = List([]);
  public loading: boolean;
  public disableScroll: boolean;
  private page = 1;
  private filter: InnerFilter<IProject>;
  private projects$ = new Subject<void>();

  constructor(private api: ProjectsService) {
    super();
  }

  public ngOnInit() {
    this.projects$
      .pipe(
        mergeMap(() => this.getProjects()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(noop, (error) => {
        console.error(error);
        this.loading = false;
      });
    this.projects$.next();
  }

  public onScroll() {
    this.page++;
    this.loading = true;
    this.projects$.next();
  }

  public onFilter(input: string) {
    this.page = 1;
    this.loading = true;
    this.cardList = List([]);
    this.filter = input ? { name: { contains: input } } : undefined;
    this.projects$.next();
  }

  private getProjects() {
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
          this.disableScroll =
            projects.length === 0 ||
            projects[0].getMetadata().paging.maxPage === this.page;
        })
      );
  }
}

ListComponent.LinkComponentToPageInfo({
  category: projectsCategory,
  menus: { actions: List(projectsMenuItemActions) },
}).AndMenuRoute(projectsMenuItem);

export { ListComponent };
