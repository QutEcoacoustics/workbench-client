import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { editSiteMenuItem, sitesCategory } from "../../sites.menus";
import data from "./edit.json";

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
    <app-form
      [schema]="schema"
      [title]="'Edit Site'"
      [error]="error"
      [submitLabel]="'Submit'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class EditComponent extends PageComponent implements OnInit {
  schema = data;
  error: string;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private api: ProjectsService
  ) {
    super();
  }

  ngOnInit() {
    this.loading = false;

    // TODO Display the name of the previous project and auto fill form with previous values
    // this is currently not working. Time zone should also provide more information for the user
    this.route.params.subscribe({
      next: params => {
        this.api.getProject(params.projectId).subscribe({
          next: project => {
            this.schema.model.name = project.name;
            this.ref.detectChanges();
          }
        });
      }
    });
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
