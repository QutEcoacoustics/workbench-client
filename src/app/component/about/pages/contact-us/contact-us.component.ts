import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { aboutCategory, contactUsMenuItem } from "../../about.menus";
import { fields } from "./contact-us.json";

@Page({
  category: aboutCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: contactUsMenuItem
})
@Component({
  selector: "app-about-contact-us",
  template: `
    <app-wip>
      <app-form
        [schema]="schema"
        [title]="'Contact Us'"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class ContactUsComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  schema = { model: {}, fields };
  loading: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
    this.loading = false;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}
