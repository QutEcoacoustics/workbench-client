import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Page } from "src/app/interfaces/pageDecorator";
import { newProjectMenuItem, projectsCategory } from "../../projects.menus";

@Page({
  category: projectsCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: newProjectMenuItem
})
@Component({
  selector: "app-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"]
})
export class NewComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
