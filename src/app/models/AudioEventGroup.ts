import { Id, Latitude, Longitude } from "@interfaces/apiInterfaces";
import { SITE } from "@baw-api/ServiceTokens";
import { AbstractModelWithoutId } from "./AbstractModel";
import { Site } from "./Site";
import { hasOne } from "./AssociationDecorators";

export interface IAudioEventGroup {
  siteId: Id<Site>;
  eventCount: number;
  latitude: Latitude;
  longitude: Longitude;
}

export class AudioEventGroup
  extends AbstractModelWithoutId<IAudioEventGroup>
  implements IAudioEventGroup
{
  public readonly kind = "Audio Event Group";

  public readonly siteId: Id<Site>;
  public readonly eventCount: number;
  public readonly latitude: Latitude;
  public readonly longitude: Longitude;

  @hasOne(SITE, "siteId")
  public readonly site?: Site;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
