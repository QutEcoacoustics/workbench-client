import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { CmsService } from "src/app/services/cms/cms.service";
import {
  aboutCategory,
  creditsMenuItem,
  disclaimersMenuItem,
  ethicsMenuItem
} from "./about.menus";

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
  templateUrl: "/src/app/services/cms/cms.template.html"
})
export class CreditsComponent extends PageComponent implements OnInit {
  blob: string;

  constructor(private cms: CmsService) {
    super();
  }

  ngOnInit() {
    this.cms.getPage("credits").subscribe(blob => {
      this.blob = blob;
    });
  }
}

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
  templateUrl: "/src/app/services/cms/cms.template.html"
})
export class DisclaimersComponent extends PageComponent implements OnInit {
  blob: string;

  constructor(private cms: CmsService) {
    super();
  }

  ngOnInit() {
    this.cms.getPage("disclaimers").subscribe(blob => {
      this.blob = blob;
    });
  }
}

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
  templateUrl: "/src/app/services/cms/cms.template.html"
})
export class EthicsComponent extends PageComponent implements OnInit {
  blob: string;

  constructor(private cms: CmsService) {
    super();
  }

  ngOnInit() {
    this.cms.getPage("ethics").subscribe(blob => {
      this.blob = blob;
    });
  }
}
