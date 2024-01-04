import { Injector } from "@angular/core";
import { websiteStatusMenuItem } from "@components/website-status/website-status.menu";
import { AbstractModelWithoutId } from "./AbstractModel";

export type WebsiteOverallStatus = "good" | "bad";
export type RedisStatus = "PONG" | "";
export type UploadStatus = "Alive" | "Dead";
export type StorageStatus =
  | "No audio recording storage directories are available."
  | `${number} audio recording storage directory available.`;

export interface IWebsiteStatus {
  status: WebsiteOverallStatus;
  timedOut: boolean;
  database: boolean;
  redis: RedisStatus;
  storage: StorageStatus;
  upload: UploadStatus;
}

export class WebsiteStatus
  extends AbstractModelWithoutId<IWebsiteStatus>
  implements IWebsiteStatus
{
  public constructor(model: IWebsiteStatus, injector?: Injector) {
    super(model, injector);
  }

  public readonly kind = "status";
  public readonly status: WebsiteOverallStatus;
  public readonly timedOut: boolean;
  public readonly database: boolean;
  public readonly redis: RedisStatus;
  public readonly storage: StorageStatus;
  public readonly upload: UploadStatus;

  public get isStatusHealthy(): boolean {
    return this.status === "good";
  }

  public get isRedisHealthy(): boolean {
    return this.redis === "PONG";
  }

  public get isStorageHealthy(): boolean {
    return this.storage !== "No audio recording storage directories are available.";
  }

  public get isUploadingHealthy(): boolean {
    return this.upload === "Alive";
  }

  public get viewUrl(): string {
    return websiteStatusMenuItem.route.toRouterLink();
  }
}
