import { Injectable } from "@angular/core";
import {
  CMS,
  Configuration,
  Environment,
  isConfiguration,
  Values,
} from "@helpers/app-initializer/app-initializer";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

/**
 * App Config Service.
 * Handles access to the deployment environment.
 */
@Injectable()
export class AppConfigService {
  private _config: Configuration;

  constructor(private notification: ToastrService) {
    if (!isConfiguration(environment)) {
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
  }

  /**
   * Get config data
   */
  public get config(): Configuration {
    return this._config;
  }

  /**
   * Get environment values
   */
  public get environment(): Environment {
    return this._config.environment;
  }

  /**
   * Get config values
   */
  public get values(): Values {
    return this._config.values;
  }

  /**
   * Retrieve cms url path
   * @param cms CMS page to retrieve
   */
  public getCms(cms: keyof CMS): string {
    console.log(this._config);

    return this.values.cms?.[cms]
      ? this.values.cms[cms]
      : "/assets/content/error.html";
  }
}
