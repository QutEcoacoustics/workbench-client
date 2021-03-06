import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageInfo } from "@helpers/page/pageInfo";
import { AccessLevel } from "@interfaces/apiInterfaces";
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
    <section *ngIf="model" class="pe-3 ps-3 pb-3">
      <baw-user-badge
        *ngFor="let badge of badges"
        [label]="badge.label"
        [user]="model[badge.userKey]"
        [timestamp]="badge.timestamp"
      ></baw-user-badge>

      <ng-container *ngIf="accessLevel">
        <h5 id="access-level-label">Your access level</h5>
        <span id="access-level" style="font-size: 0.9rem">
          {{ accessLevel }}
        </span>
      </ng-container>
    </section>
  `,
})
export class PermissionsShieldComponent implements OnInit, WidgetComponent {
  public accessLevel: string;
  public badges = [];
  public model: AbstractModel;
  public pageData: any;

  public constructor(private route: ActivatedRoute) {}

  public ngOnInit() {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);
    this.model = this.retrieveModel(models);

    if (!this.model) {
      return;
    }

    this.badges = this.createBadges(this.model);
    this.accessLevel = this.getAccessLevel(models as ResolvedModelList);
  }

  private retrieveModel(models: false | ResolvedModelList): AbstractModel {
    const modelKeys = models ? Object.keys(models) : [];

    if (!models || modelKeys.length === 0) {
      return undefined;
    }

    // Grab model in order of priority, site, then region, then project
    const priority = [Site, Region, Project];
    for (const modelType of priority) {
      for (const modelKey of modelKeys) {
        if (models[modelKey] instanceof modelType) {
          return models[modelKey] as AbstractModel;
        }
      }
    }

    // If model not found, grab any abstract model
    for (const model of modelKeys) {
      if (models[model] instanceof AbstractModel) {
        return models[model] as AbstractModel;
      }
    }

    return undefined;
  }

  private createBadges(model: AbstractModel) {
    const badges = [];

    [
      {
        id: "creatorId",
        label: "Created By",
        userKey: "creator",
        timestampKey: "createdAt",
      },
      {
        id: "updaterId",
        label: "Updated By",
        userKey: "updater",
        timestampKey: "updatedAt",
      },
      {
        id: "ownerId",
        label: "Owned By",
        userKey: "owner",
      },
    ].forEach((badge) => {
      if (isInstantiated(model[badge.id])) {
        badges.push({
          label: badge.label,
          userKey: badge.userKey,
          timestamp: model[badge.timestampKey],
        });
      }
    });

    return badges;
  }

  private getAccessLevel(resolvedModels: ResolvedModelList): AccessLevel {
    if (resolvedModels.project) {
      return resolvedModels.project["accessLevel"];
    }

    return this.model["accessLevel"] ?? null;
  }
}
