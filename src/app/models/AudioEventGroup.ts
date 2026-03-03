import { PROJECT, REGION, SITE } from "@baw-api/ServiceTokens";
import { Id, Ids, Latitude, Longitude } from "@interfaces/apiInterfaces";
import { AbstractModelWithoutId } from "./AbstractModel";
import { hasMany, hasOne } from "./AssociationDecorators";
import { Project } from "./Project";
import { Region } from "./Region";
import { Site } from "./Site";

export interface IAudioEventGroup {
  siteId: Id<Site>;
  regionId: Id<Region> | null;
  projectIds: Ids<Project>;
  audioEventCount: number;
  latitude: Latitude;
  longitude: Longitude;
  locationObfuscated: boolean;
}

export class AudioEventGroup
  extends AbstractModelWithoutId<IAudioEventGroup>
  implements IAudioEventGroup
{
  public readonly kind = "Audio Event Group";

  public readonly siteId: Id<Site>;
  public readonly regionId: Id<Region> | null;
  public readonly projectIds: Ids<Project>;

  public readonly audioEventCount: number;
  public readonly latitude: Latitude;
  public readonly longitude: Longitude;
  public readonly locationObfuscated: boolean;

  @hasOne(SITE, "siteId")
  public readonly site?: Site;

  @hasOne(REGION, "regionId")
  public readonly region?: Region;

  @hasMany(PROJECT, "projectIds")
  public readonly projects?: Project[];

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
