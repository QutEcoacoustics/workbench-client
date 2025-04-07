import { Component, OnInit } from "@angular/core";
import {
  hasResolvedSuccessfully,
  ResolvedModelList,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { PermissionLevel, Id, Ids } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { map, takeUntil } from "rxjs";
import { Harvest } from "@models/Harvest";
import { WidgetComponent } from "../widget.component";

/**
 * Permissions Shield Component.
 * Displays the user badges and access levels for the model.
 * TODO Let page decide which model to display permissions for
 */
@Component({
  selector: "baw-permissions-shield-widget",
  template: `
    <section *ngIf="model" class="pb-3">
      <div *ngFor="let badge of badges">
        <h5 id="label">{{ badge.label }}</h5>

        <baw-user-badge
          [users]="model[badge.userKey]"
          [timestamp]="badge.timestamp"
        ></baw-user-badge>
      </div>

      <ng-container *ngIf="accessLevel">
        <h5 id="access-level-label">Your access level</h5>
        <span id="access-level" style="font-size: 0.9rem">
          {{ accessLevel | titlecase }}
        </span>
      </ng-container>
    </section>
  `,
  standalone: false
})
export class PermissionsShieldComponent
  extends withUnsubscribe()
  implements OnInit, WidgetComponent
{
  public accessLevel: string;
  public badges = [];
  public model: AbstractModel;
  public pageData: IPageInfo;
  private project: Project;

  public constructor(private sharedRoute: SharedActivatedRouteService) {
    super();
  }

  public ngOnInit(): void {
    this.sharedRoute.pageInfo
      .pipe(
        map((page): ResolvedModelList => retrieveResolvers(page)),
        takeUntil(this.unsubscribe)
      )
      .subscribe((models): void => {
        this.model = this.retrieveModel(models);
        if (!this.model) {
          return;
        }
        this.badges = this.createBadges(this.model);
        this.accessLevel = this.getAccessLevel();
      });
  }

  private retrieveModel(models: ResolvedModelList): AbstractModel {
    const modelKeys = Object.keys(models);

    if (!hasResolvedSuccessfully(models) || modelKeys.length === 0) {
      return undefined;
    }

    // Grab model in order of priority, site, then region, then project
    // if the user is looking at a harvest, we should show the harvest information
    const priorityLevels = {
      harvest: 0,
      site: 1,
      region: 2,
      project: 3,
      anyModel: 4,
    };

    let outputModel: AbstractModel;
    let priority: number;
    for (const modelKey of modelKeys) {
      const model = models[modelKey];

      const assignModel = <Model extends AbstractModel>(
        _model: Model,
        level: number
      ): void => {
        outputModel = _model;
        priority = level;
      };

      if (model instanceof Project) {
        this.project = model;
      }

      if (model instanceof Harvest) {
        assignModel(model , priorityLevels.harvest);
      } else if (model instanceof Site) {
        assignModel(model, priorityLevels.site);
      } else if (priority > priorityLevels.region && model instanceof Region) {
        assignModel(model, priorityLevels.region);
      } else if (
        priority > priorityLevels.project &&
        model instanceof Project
      ) {
        assignModel(model, priorityLevels.project);
      } else if (!outputModel && model instanceof AbstractModel) {
        assignModel(model, priorityLevels.anyModel);
      }
    }

    return outputModel;
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
        id: "ownerIds",
        label: "Owned By",
        userKey: "owners",
      },
    ].forEach((badge) => {
      const id: Id | Ids = model[badge.id];
      const idExists = typeof id === "number" && isInstantiated(id);
      const idsExists = id instanceof Set && id.size > 0;

      if (idExists || idsExists) {
        badges.push({
          label: badge.label,
          userKey: badge.userKey,
          timestamp: model[badge.timestampKey],
        });
      }
    });

    return badges;
  }

  private getAccessLevel(): PermissionLevel {
    if (this.project) {
      return this.project.accessLevel;
    }

    return this.model["accessLevel"] ?? null;
  }
}
