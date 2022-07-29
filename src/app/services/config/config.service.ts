import { HttpBackend, HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import {
  Configuration,
  Endpoints,
  isConfiguration,
  Keys,
  Settings,
} from "@helpers/app-initializer/app-initializer";
import { embedGoogleMaps } from "@helpers/embedGoogleMaps/embedGoogleMaps";
import { ThemeService } from "@services/theme/theme.service";
import { ToastrService } from "ngx-toastr";
import { catchError, firstValueFrom, mergeMap, of, retry } from "rxjs";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

export const assetRoot = "/assets";

/**
 * Config Service.
 * Handles access to the deployment environment.
 */
@Injectable()
export class ConfigService {
  private _validConfig: boolean;
  private _config: Configuration;
  private http: HttpClient;

  public constructor(
    private notification: ToastrService,
    private theme: ThemeService,
    handler: HttpBackend,
    @Inject(IS_SERVER_PLATFORM) private isServer: boolean
  ) {
    // This is to bypass the interceptor and prevent circular dependencies
    // (interceptor requires API_ROOT)
    this.http = new HttpClient(handler);
  }

  public async init(defaultConfig?: Promise<Configuration>): Promise<void> {
    const embedGoogleMapsIfValid = async () => {
      if (this.validConfig) {
        await embedGoogleMaps();
      }
    };

    if (defaultConfig) {
      this.setConfig(await defaultConfig);
      await embedGoogleMapsIfValid();
      return;
    }

    return firstValueFrom(
      this.http.get("assets/environment.json").pipe(
        retry({ count: 5, delay: 1000 }),
        // API Interceptor is not transforming this error
        catchError((err: any) => {
          console.error("API_CONFIG Failed to load configuration file: ", err);
          return of(undefined);
        }),
        mergeMap(async (config): Promise<void> => {
          this.setConfig(new Configuration(config));
          await embedGoogleMapsIfValid();
        })
      )
    );
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
        {
          closeButton: false,
          disableTimeOut: true,
          tapToDismiss: false,
          positionClass: "toast-center-center",
        }
      );
      return;
    }

    this._validConfig = true;
    this.theme.setTheme(this.settings.theme ?? {});
  }
}
