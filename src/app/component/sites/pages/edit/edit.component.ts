import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { editSiteMenuItem, sitesCategory } from "../../sites.menus";
import data from "./edit.json";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";

@Page({
  category: sitesCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: editSiteMenuItem
})
@Component({
  selector: "app-sites-edit",
  template: `
    <app-wip>
      <app-form
        *ngIf="ready"
        [schema]="schema"
        [title]="'Edit Site'"
        [error]="error"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class EditComponent extends PageComponent implements OnInit {
  schema = data;
  error: string;
  loading: boolean;
  ready: boolean;

  constructor(private route: ActivatedRoute, private api: SitesService) {
    super();
  }

  ngOnInit() {
    this.ready = false;
    this.loading = false;

    this.route.params
      .pipe(
        flatMap(params => {
          return this.api.getProjectSite(params.projectId, params.siteId);
        })
      )
      .subscribe(
        site => {
          this.schema.model.name = site.name;
          this.ready = true;
        },
        (err: APIErrorDetails) => {}
      );
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}
