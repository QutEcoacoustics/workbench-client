import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
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
      <ng-container *ngIf="accessLevel">
        <h4>Your access level</h4>
        <p>{{ accessLevel }}</p>
      </ng-container>
    </div>
  `,
  styleUrls: ["./permissions-shield.component.scss"],
})
export class PermissionsShieldComponent implements OnInit, WidgetComponent {
  public model: AbstractModel;
  public accessLevel: string;
  public pageData: any;

  constructor(private route: ActivatedRoute) {}

  public ngOnInit() {
    const resolvedModels = retrieveResolvers(this.route.snapshot.data);
    const modelKeys = resolvedModels ? Object.keys(resolvedModels) : [];

    if (!resolvedModels) {
      this.model = undefined;
      return;
    }

    // Grab model in order of priority, site, then region, then project
    const priority = [Site, Region, Project];
    for (const modelType of priority) {
      for (const modelKey of modelKeys) {
        if (resolvedModels[modelKey] instanceof modelType) {
          this.model = resolvedModels[modelKey] as AbstractModel;
          break;
        }
      }

      if (this.model) {
        break;
      }
    }

    // If model not found, grab any abstract model
    if (!this.model && modelKeys.length > 1) {
      modelKeys.forEach((model) => {
        if (resolvedModels[model] instanceof AbstractModel) {
          this.model = resolvedModels[model] as AbstractModel;
          return;
        }
      });
    }

    this.getAccessLevel(resolvedModels);
  }

  private getAccessLevel(resolvedModels: ResolvedModelList) {
    if (resolvedModels.project) {
      this.accessLevel = resolvedModels.project["accessLevel"];
    }

    if (this.model?.["accessLevel"]) {
      this.accessLevel = this.model["accessLevel"];
    }
  }
}
