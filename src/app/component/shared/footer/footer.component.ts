import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { version } from "package.json";
import { AppConfigService } from "src/app/services/app-config/app-config.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  public version: string = version;

  // TODO Update this to the internal routes
  routes = {
    contactUs: this.config.getConfig().environment.apiRoot + "/contact_us",
    ethics: this.config.getConfig().environment.apiRoot + "/ethics_statement",
    credits: this.config.getConfig().environment.apiRoot + "/credits",
    disclaimers: this.config.getConfig().environment.apiRoot + "/disclaimers",
    statistics: this.config.getConfig().environment.apiRoot + "/website_status"
  };

  constructor(private config: AppConfigService) {}

  ngOnInit() {}
}
