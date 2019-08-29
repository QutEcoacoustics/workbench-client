import { Injectable } from "@angular/core";

@Injectable()
export class AppConfigService {
  private appConfig: any;

  constructor() {}

  async loadAppConfig(): Promise<any> {
    // Using fetch because HttpClient fails. Could be an issue due
    // to the use of a HttpInterceptor:
    // https://github.com/rfreedman/angular-configuration-service/issues/1
    const response = await fetch("assets/config/production.json");
    const data = await response.json();
    this.appConfig = data;
  }

  getConfig() {
    return this.appConfig;
  }
}
