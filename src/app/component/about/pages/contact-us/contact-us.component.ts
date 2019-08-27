import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { aboutCategory, contactUsMenuItem } from "../../about.menus";
import data from "./contact-us.json";

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
    <app-form
      [schema]="schema"
      [title]="'Contact Us'"
      [error]="error"
      [submitLabel]="'Submit'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class ContactUsComponent extends PageComponent implements OnInit {
  schema = data;
  error: string;
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
