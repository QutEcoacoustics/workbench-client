import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { environment } from "src/environments/environment";
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

  constructor() {
    super();
  }

  ngOnInit() {
    this.page = environment.values.cms.disclaimers;
  }
}
