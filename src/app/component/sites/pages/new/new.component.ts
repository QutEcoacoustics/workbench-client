import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap } from "rxjs/operators";
import {
  newProjectMenuItem,
  projectsMenuItem,
  requestProjectMenuItem
} from "src/app/component/projects/projects.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { newSiteMenuItem, sitesCategory } from "../../sites.menus";
import data from "./new.json";

@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([
      projectsMenuItem,
      newProjectMenuItem,
      requestProjectMenuItem
    ]),
    links: List()
  },
  self: newSiteMenuItem
})
@Component({
  selector: "app-sites-new",
  template: `
    <app-wip>
      <app-form
        [schema]="schema"
        [title]="'New Site'"
        [error]="error"
        [success]="success"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class NewComponent extends PageComponent implements OnInit, OnDestroy {
  error: string;
  loading: boolean;
  schema = data;
  subSink: SubSink = new SubSink();
  success: string;

  constructor(
    private api: SitesService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.loading = false;
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    this.ref.detectChanges();

    this.subSink.sink = this.route.params
      .pipe(
        flatMap(params => {
          return this.api.newProjectSite(params.projectId, $event);
        })
      )
      .subscribe(
        () => {
          this.success = "Site was successfully created.";
          this.loading = false;
        },
        err => {
          this.error = err;
          this.loading = false;
        }
      );
  }
}
