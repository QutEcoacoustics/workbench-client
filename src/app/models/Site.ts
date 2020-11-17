import { Injector } from "@angular/core";
import { id, IdOr } from "@baw-api/api-common";
import { PROJECT } from "@baw-api/ServiceTokens";
import { pointMenuItem } from "@components/sites/points.menus";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  exploreAudioMenuItem,
  listenMenuItem,
} from "@helpers/page/externalMenus";
import { assetRoot } from "@services/app-config/app-config.service";
import { MapMarkerOption } from "@shared/map/map.component";
import { siteMenuItem } from "../components/sites/sites.menus";
import {
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  Id,
  Ids,
  ImageUrl,
  Notes,
  Param,
  TimezoneInformation,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasMany, Updater } from "./AssociationDecorators";
import {
  BawCollection,
  BawDateTime,
  BawImage,
  BawPersistAttr,
} from "./AttributeDecorators";
import type { Project } from "./Project";
import type { User } from "./User";

/**
 * A site model.
 */
export interface ISite extends HasAllUsers, HasDescription {
  id?: Id;
  name?: Param;
  imageUrl?: string;
  locationObfuscated?: boolean;
  projectIds?: Ids | Id[];
  regionId?: Id;
  latitude?: number;
  customLatitude?: number;
  longitude?: number;
  customLongitude?: number;
  tzinfoTz?: string;
  timezoneInformation?: TimezoneInformation;
  notes?: Notes;
}

/**
 * A site model.
 */
export class Site extends AbstractModel implements ISite {
  public readonly kind = "Site";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly imageUrl?: string;
  @BawImage<Site>(`${assetRoot}/images/site/site_span4.png`, {
    key: "imageUrl",
  })
  public readonly image?: ImageUrl[];
  @BawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  public readonly locationObfuscated?: boolean;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  @BawCollection({ persist: true })
  public readonly projectIds?: Ids;
  @BawPersistAttr
  public readonly regionId?: Id;
  @BawPersistAttr
  public readonly latitude?: number;
  public readonly customLatitude?: number;
  @BawPersistAttr
  public readonly longitude?: number;
  public readonly customLongitude?: number;
  @BawPersistAttr
  public readonly tzinfoTz?: string;
  public readonly timezoneInformation?: TimezoneInformation;
  @BawPersistAttr
  public readonly notes?: Notes;

  // Associations
  @Creator<Site>()
  public creator?: User;
  @Updater<Site>()
  public updater?: User;
  @HasMany<Site, Project>(PROJECT, "projectIds")
  public projects?: Project[];

  constructor(site: ISite, injector?: Injector) {
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
      console.error("Site model has no project id, cannot find url.");
      return "";
    }

    return this.getViewUrl(this.projectIds.values().next().value);
  }

  public get playUrl(): string {
    return listenMenuItem.uri();
  }

  public get visualizeUrl(): string {
    return exploreAudioMenuItem.uri({ siteId: this.id });
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
