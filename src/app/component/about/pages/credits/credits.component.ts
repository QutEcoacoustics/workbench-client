import { ChangeDetectionStrategy, Component } from "@angular/core";
import { List } from "immutable";
import { Page } from "src/app/helpers/page/pageDecorator";
import { aboutCategory, creditsMenuItem } from "../../about.menus";

@Page({
  category: aboutCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: creditsMenuItem
})
@Component({
  selector: "app-about-credits",
  template: `
    <app-cms page="credits.html"></app-cms>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditsComponent {}
