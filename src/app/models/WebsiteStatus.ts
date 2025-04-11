import { websiteStatusMenuItem } from "@components/website-status/website-status.menu";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModelWithoutId } from "./AbstractModel";
import { AssociationInjector } from "./ImplementsInjector";

export type WebsiteOverallStatus = "good" | "bad";
export type RedisStatus = "PONG" | "";
export type UploadStatus = "Alive" | "Dead";
export type StorageStatus =
  | "No audio recording storage directories are available."
  | `${number} audio recording storage directory available.`;
export type BatchAnalysisStatus = "Connected" | "Failed to connect";

export interface IWebsiteStatus {
  status: WebsiteOverallStatus | undefined;
  timedOut: boolean | undefined;
  database: boolean | undefined;
  redis: RedisStatus | undefined;
  storage: StorageStatus | undefined;
  upload: UploadStatus | undefined;
  batchAnalysis: BatchAnalysisStatus | undefined;
}

export class WebsiteStatus extends AbstractModelWithoutId<Partial<IWebsiteStatus>> implements IWebsiteStatus {
  public constructor(model: Partial<IWebsiteStatus>, injector?: AssociationInjector) {
    super(model, injector);
  }

  public readonly kind = "status";
  public readonly status: WebsiteOverallStatus | undefined;
  public readonly timedOut: boolean | undefined;
  public readonly database: boolean | undefined;
  public readonly redis: RedisStatus | undefined;
  public readonly storage: StorageStatus | undefined;
  public readonly upload: UploadStatus | undefined;
  public readonly batchAnalysis: BatchAnalysisStatus | undefined;

  public get isStatusHealthy(): boolean | null {
    return isInstantiated(this.status) ? this.status === "good" : null;
  }

  public get isServerConnectionHealthy(): boolean | null {
    return isInstantiated(this.timedOut) ? !this.timedOut : null;
  }

  public get isDatabaseHealthy(): boolean | null {
    return isInstantiated(this.database) ? this.database : null;
  }

  public get isRedisHealthy(): boolean | null {
    return isInstantiated(this.redis) ? this.redis === "PONG" : null;
  }

  public get isStorageHealthy(): boolean | null {
    return isInstantiated(this.storage)
      ? this.storage !== "No audio recording storage directories are available."
      : null;
  }

  public get isUploadingHealthy(): boolean | null {
    return isInstantiated(this.upload) ? this.upload === "Alive" : null;
  }

  public get isBatchAnalysisHealthy(): boolean | null {
    return isInstantiated(this.batchAnalysis) ? this.batchAnalysis === "Connected" : null;
  }

  public get onLine(): boolean {
    return navigator.onLine;
  }

  public get viewUrl(): string {
    return websiteStatusMenuItem.route.toRouterLink();
  }
}

export class ServerTimeout extends WebsiteStatus {
  private constructor() {
    super({
      timedOut: true,
    });
  }

  public static readonly instance = new ServerTimeout();
}

export class SsrContext extends WebsiteStatus {
  private constructor() {
    super({});
  }

  public static readonly instance = new SsrContext();

  public override get onLine(): boolean {
    return false;
  }
}
