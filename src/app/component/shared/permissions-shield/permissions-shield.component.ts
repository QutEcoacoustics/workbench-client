import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import { WidgetComponent } from "../widget/widget.component";

@Component({
  selector: "app-permissions-shield",
  template: `
    <div *ngIf="model">
      <app-user-badges [model]="model"></app-user-badges>
      <h4>Your access level</h4>
      <p>Not Implemented</p>
    </div>
  `,
  styleUrls: ["./permissions-shield.component.scss"]
})
export class PermissionsShieldComponent implements OnInit, WidgetComponent {
  public model: Site | Project;
  public pageData: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const projectModel: ResolvedModel<Project> = this.route.snapshot.data
      .project;
    const siteModel: ResolvedModel<Site> = this.route.snapshot.data.site;

    if (siteModel && !siteModel.error) {
      this.model = siteModel.model;
    } else if (projectModel && !projectModel.error) {
      this.model = projectModel.model;
    }
  }
}
