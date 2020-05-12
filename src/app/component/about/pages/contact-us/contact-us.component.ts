import { Component, OnInit } from "@angular/core";
import { aboutCategory, contactUsMenuItem } from "@component/about/about.menus";
import { WithFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { List } from "immutable";
import { fields } from "./contact-us.schema.json";

@Page({
  category: aboutCategory,
  menus: {
    actions: List(),
    links: List(),
  },
  self: contactUsMenuItem,
})
@Component({
  selector: "app-about-contact-us",
  template: `
    <app-wip>
      <app-form
        title="Contact Us"
        [model]="model"
        [fields]="fields"
        submitLabel="Submit"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `,
})
export class ContactUsComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public model = {};
  public fields = fields;
  public loading: boolean;

  constructor() {
    super();
  }

  ngOnInit() {}

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
