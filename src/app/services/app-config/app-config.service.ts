import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Title } from "@angular/platform-browser";

export let APP_CONFIG = new InjectionToken("app.config");

@Injectable()
export class AppConfigService {
  private appConfig: any;

  constructor(
    @Inject(APP_CONFIG) private config: string,
    private titleService: Title
  ) {}

  async loadAppConfig(): Promise<any> {
    // Using fetch because HttpClient fails. Could be an issue due
    // to the use of a HttpInterceptor:
    // https://github.com/rfreedman/angular-configuration-service/issues/1
    const response = await fetch(this.config);
    const data = await response.json();
    this.appConfig = data;
    this.titleService.setTitle(this.appConfig.values.brand.name);
  }

  getConfig() {
    return this.appConfig;
  }
}
