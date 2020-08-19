import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { WidgetComponent } from "../widget/widget.component";

/**
 * Permissions Shield Component.
 * Displays the user badges and access levels for the model.
 */
@Component({
  selector: "baw-permissions-shield",
  template: `
    <div *ngIf="model">
      <baw-user-badges *ngIf="model" [model]="model"></baw-user-badges>
      <h4>Your access level</h4>
      <p>Not Implemented</p>
    </div>
  `,
  styleUrls: ["./permissions-shield.component.scss"],
})
export class PermissionsShieldComponent implements OnInit, WidgetComponent {
  public model: Site | Project;
  public pageData: any;

  constructor(private route: ActivatedRoute) {}

  public ngOnInit() {
    const resolvedModels = retrieveResolvers(this.route.snapshot.data);

    if (!resolvedModels) {
      this.model = undefined;
    } else if (resolvedModels.site) {
      this.model = resolvedModels.site as Site;
    } else if (resolvedModels.project) {
      this.model = resolvedModels.project as Project;
    }
  }
}
