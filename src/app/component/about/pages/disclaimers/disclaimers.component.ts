import { ChangeDetectionStrategy, Component } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
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
    <app-cms page="disclaimers.html"></app-cms>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisclaimersComponent extends PageComponent {
  constructor() {
    super();
  }
}
