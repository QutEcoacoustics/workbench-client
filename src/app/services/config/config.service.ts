import { HttpBackend, HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import {
  Configuration,
  Endpoints,
  IConfiguration,
  isConfiguration,
  Keys,
  Settings,
} from "@helpers/app-initializer/app-initializer";
import { embedGoogleAnalytics } from "@helpers/embedScript/embedGoogleAnalytics";
import { ThemeService } from "@services/theme/theme.service";
import { ToastService } from "@services/toasts/toasts.service";
import { catchError, firstValueFrom, mergeMap, of, retry } from "rxjs";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { environment } from "src/environments/environment";

export const assetRoot = "/assets";

/**
 * Config Service.
 * Handles access to the deployment environment.
 */
@Injectable({ providedIn: "root" })
export class ConfigService {
  private _validConfig: boolean;
  private _config: Configuration;
  private http: HttpClient;

  public constructor(
    private notification: ToastService,
    private theme: ThemeService,
    handler: HttpBackend,
    @Inject(IS_SERVER_PLATFORM) private isServer: boolean
  ) {
    // This is to bypass the interceptor and prevent circular dependencies
    // (interceptor requires API_ROOT)
    // https://stackoverflow.com/questions/57850927/angular-app-initializer-circular-dependencies-at-runtime
    this.http = new HttpClient(handler);
  }

  public async init(defaultConfig?: Promise<IConfiguration>): Promise<void> {
    const embedGoogleServicesIfValid = async () => {
      // Only insert if valid config, and not SSR
      if (this.validConfig && !this.isServer) {
        embedGoogleAnalytics(this.keys.googleAnalytics.trackingId);
      }
    };

    if (defaultConfig) {
      this.setConfig(await defaultConfig);
      await embedGoogleServicesIfValid();
      return;
    }

    // if we are in ssr, we can read the file directly from the file system
    // instead of using the http client
    if (this.isServer) {
      const config = await import("../../../assets/environment.json");
      this.setConfig(new Configuration(config));
      await embedGoogleServicesIfValid();
      return;
    }

    return firstValueFrom(
      this.http.get("assets/environment.json").pipe(
        retry({ count: 5, delay: 250 }),
        mergeMap(async (config): Promise<void> => {
          this.setConfig(new Configuration(config));
          await embedGoogleServicesIfValid();
        }),
        // API Interceptor is not transforming this error
        catchError((err: any) => {
          console.error("API_CONFIG Failed to load configuration file: ", err);
          this.setConfig(new Configuration(undefined));
          return of(undefined);
        })
      )
    );
  }

  /** Get environment */
  public get environment() {
    return environment;
  }

  /** Get config data */
  public get config(): Configuration {
    return this._config;
  }

  /** Get endpoint values */
  public get endpoints(): Endpoints {
    return this._config.endpoints;
  }

  /** Get key values */
  public get keys(): Keys {
    return this._config.keys;
  }

  /** Get setting values */
  public get settings(): Settings {
    return this._config.settings;
  }

  /** True if the current config is valid */
  public get validConfig(): boolean {
    return this._validConfig;
  }

  private setConfig(config: Configuration): void {
    this._config = new Proxy(config, {});

    if (!isConfiguration(config, this.isServer)) {
      console.error("Detected invalid environment.");
      this._validConfig = false;
      this.notification.error(
        "The website is not configured correctly. Try coming back at another time.",
        "Unrecoverable Error",
        { autoHide: false }
      );
      return;
    }

    this._validConfig = true;
    this.theme.setTheme(this.settings.theme ?? {});
  }
}
