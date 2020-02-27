import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { DeploymentEnvironmentService } from "src/app/services/environment/deployment-environment.service";
import { aboutCategory, disclaimersMenuItem } from "../../about.menus";

@Page({
  category: aboutCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: disclaimersMenuItem
})
@Component({
  selector: "app-about-disclaimers",
  template: `
    <app-cms [page]="page"></app-cms>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisclaimersComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: DeploymentEnvironmentService) {
    super();
  }

  ngOnInit() {
    this.page = this.env.getValues().cms.disclaimers;
  }
}
