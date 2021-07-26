import { Inject, Injectable } from "@angular/core";
import {
  Configuration,
  Endpoints,
  isConfiguration,
  Keys,
  Settings,
} from "@helpers/app-initializer/app-initializer";
import { CssTheme, ThemeService } from "@services/theme/theme.service";
import { ToastrService } from "ngx-toastr";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { environment } from "src/environments/environment";

export const assetRoot = "/assets";

/**
 * Config Service.
 * Handles access to the deployment environment.
 */
@Injectable()
export class ConfigService {
  private _config: Configuration;

  public constructor(
    private notification: ToastrService,
    private theme: ThemeService,
    @Inject(IS_SERVER_PLATFORM) private isServer: boolean
  ) {
    if (!isConfiguration(environment, this.isServer)) {
      console.error("Detected invalid environment.");
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

    this._config = new Proxy(environment, {});

    // Set website theme
    if (this.settings.theme) {
      for (const pallette of Object.keys(this.settings.theme)) {
        this.theme.setTheme(
          pallette as CssTheme,
          this.settings.theme[pallette]
        );
      }
    }
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
}
