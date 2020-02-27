import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DeploymentEnvironmentService } from "src/app/services/environment/deployment-environment.service";
import {
  contactUsMenuItem,
  creditsMenuItem,
  disclaimersMenuItem,
  ethicsMenuItem
} from "../../about/about.menus";
import { statisticsMenuItem } from "../../statistics/statistics.menus";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  version: string;
  year: number = new Date().getFullYear();

  routes = {
    contactUs: contactUsMenuItem,
    ethics: ethicsMenuItem,
    credits: creditsMenuItem,
    disclaimers: disclaimersMenuItem,
    statistics: statisticsMenuItem
  };

  constructor(private env: DeploymentEnvironmentService) {}

  ngOnInit() {
    this.version = this.env.getDeployment().version;
  }
}
