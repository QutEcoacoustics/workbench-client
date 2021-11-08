import { Injector } from "@angular/core";
import { id, IdOr } from "@baw-api/api-common";
import { PROJECT } from "@baw-api/ServiceTokens";
import { adminOrphanMenuItem } from "@components/admin/orphan/orphans.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { visualizeMenuItem } from "@components/visualize/visualize.menus";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { assetRoot } from "@services/config/config.service";
import { MapMarkerOption } from "@shared/map/map.component";
import { siteMenuItem } from "../components/sites/sites.menus";
import {
  AccessLevel,
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  Hash,
  Id,
  Ids,
  ImageUrl,
  Param,
  TimezoneInformation,
} from "../interfaces/apiInterfaces";
import { AbstractModel, UnresolvedModel } from "./AbstractModel";
import { creator, hasMany, updater } from "./AssociationDecorators";
import {
  bawCollection,
  bawDateTime,
  bawImage,
  bawPersistAttr,
} from "./AttributeDecorators";
import type { Project } from "./Project";
import type { User } from "./User";

/**
 * A site model.
 */
export interface ISite extends HasAllUsers, HasDescription {
  id?: Id;
  name?: Param;
  imageUrls?: ImageUrl[];
  image?: File;
  locationObfuscated?: boolean;
  projectIds?: Ids | Id[];
  regionId?: Id;
  latitude?: number;
  customLatitude?: number;
  longitude?: number;
  customLongitude?: number;
  tzinfoTz?: string;
  timezoneInformation?: TimezoneInformation;
  notes?: Hash;
}

/**
 * A site model.
 */
export class Site extends AbstractModel<ISite> implements ISite {
  public readonly kind = "site";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly name?: Param;
  @bawImage<ISite>(`${assetRoot}/images/site/site_span4.png`)
  public readonly imageUrls!: ImageUrl[];
  @bawPersistAttr({ create: true, update: true, formData: true })
  public readonly image?: File;
  @bawPersistAttr()
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  public readonly locationObfuscated?: boolean;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  @bawCollection({ persist: true })
  public readonly projectIds?: Ids;
  @bawPersistAttr()
  public readonly regionId?: Id;
  @bawPersistAttr()
  public readonly latitude?: number;
  public readonly customLatitude?: number;
  @bawPersistAttr()
  public readonly longitude?: number;
  public readonly customLongitude?: number;
  @bawPersistAttr()
  public readonly tzinfoTz?: string;
  public readonly timezoneInformation?: TimezoneInformation;
  @bawPersistAttr()
  public readonly notes?: Hash;

  // Associations
  @creator<Site>()
  public creator?: User;
  @updater<Site>()
  public updater?: User;
  @hasMany<Site, Project>(PROJECT, "projectIds")
  public projects?: Project[];

  public constructor(site: ISite, injector?: Injector) {
    super(site, injector);

    this.tzinfoTz = this.tzinfoTz ?? this.timezoneInformation?.identifier;

    // This only affects admins, owners, and if not coordinate is set
    if (!this.locationObfuscated) {
      this.latitude = this.latitude ?? this.customLatitude;
      this.longitude = this.longitude ?? this.customLongitude;
    }
  }

  public get viewUrl(): string {
    if (this.projectIds.size === 0) {
      // TODO Figure out how to better handle this issue? It should only happen
      // for admin users in the orphan sites page
      throw new Error("Site model has no project id, cannot find url.");
    }

    return this.getViewUrl(this.projectIds.values().next().value);
  }

  public get adminViewUrl(): string {
    return adminOrphanMenuItem.route.format({ siteId: this.id });
  }

  public get visualizeUrl(): string {
    return visualizeMenuItem.route.format(undefined, { siteId: this.id });
  }

  public getViewUrl(project: IdOr<Project>): string {
    if (isInstantiated(this.regionId)) {
      return pointMenuItem.route.format({
        projectId: id(project),
        regionId: this.regionId,
        siteId: this.id,
      });
    } else {
      return siteMenuItem.route.format({
        projectId: id(project),
        siteId: this.id,
      });
    }
  }

  public get accessLevel(): AccessLevel {
    if ((this.projects as any) === UnresolvedModel.many) {
      return AccessLevel.unresolved;
    }

    if (this.projects.length === 0) {
      return AccessLevel.unknown;
    }

    let isWriter = false;

    for (const project of this.projects) {
      if (project.accessLevel === AccessLevel.owner) {
        return project.accessLevel;
      } else if (project.accessLevel === AccessLevel.writer) {
        isWriter = true;
      }
    }

    return isWriter ? AccessLevel.writer : AccessLevel.reader;
  }

  /**
   * Returns true if site should display as a point
   */
  public get isPoint() {
    return isInstantiated(this.regionId);
  }

  /**
   * Get site latitude
   */
  public getLatitude(): number {
    return this.latitude ?? this.customLatitude;
  }

  /**
   * Get site longitude
   */
  public getLongitude(): number {
    return this.longitude ?? this.customLongitude;
  }

  /**
   * Create google maps marker options
   * ! When using map markers, you should always run the output through `sanitizeMapMarkers()`
   */
  public getMapMarker(): MapMarkerOption {
    const hasCoordinates =
      isInstantiated(this.getLatitude()) && isInstantiated(this.getLongitude());

    return hasCoordinates
      ? {
          position: { lat: this.getLatitude(), lng: this.getLongitude() },
          label: this.name,
        }
      : null;
  }
}
