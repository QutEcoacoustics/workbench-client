import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from "@angular/core";
import { List } from "immutable";
import { CMS, CMS_DATA } from "src/app/helpers/app-initializer/app-initializer";
import { PageComponent } from "src/app/helpers/page/pageComponent";
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
    <app-cms [page]="page"></app-cms>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditsComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(@Inject(CMS_DATA) private cms: CMS) {
    super();
  }

  ngOnInit() {
    this.page = this.cms.credits;
  }
}
