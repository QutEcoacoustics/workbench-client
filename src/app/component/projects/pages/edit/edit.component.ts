import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { editProjectMenuItem, projectCategory } from "../../projects.menus";

@Page({
  category: projectCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: editProjectMenuItem
})
@Component({
  selector: "app-projects-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class EditComponent extends PageComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
