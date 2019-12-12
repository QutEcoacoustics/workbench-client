import { ChangeDetectionStrategy, Component } from "@angular/core";
import { List } from "immutable";
import { Page } from "src/app/helpers/page/pageDecorator";
import { aboutCategory, ethicsMenuItem } from "../../about.menus";

@Page({
  category: aboutCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: ethicsMenuItem
})
@Component({
  selector: "app-about-ethics",
  template: `
    <app-cms page="ethics.html"></app-cms>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EthicsComponent {}
