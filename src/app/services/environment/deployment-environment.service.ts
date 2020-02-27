import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import {
  Environment,
  EnvironmentRoots,
  EnvironmentValues,
  isErrorConfiguration
} from "src/app/helpers/app-initializer/app-initializer";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class DeploymentEnvironmentService {
  constructor(private notification: ToastrService) {
    if (isErrorConfiguration(environment)) {
      console.error("Detected invalid environment.");
      this.notification.error(
        "The application is not configured correctly and cannot run. Try leaving the page and coming back.",
        "Unrecoverable Error",
        {
          closeButton: false,
          disableTimeOut: true,
          tapToDismiss: false,
          positionClass: "toast-center-center"
        }
      );
    }
  }

  getDeployment(): Environment {
    return environment as Environment;
  }

  getEnvironment(): EnvironmentRoots {
    return environment.environment;
  }

  getValues(): EnvironmentValues {
    return environment.values;
  }
}
