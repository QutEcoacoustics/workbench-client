import { Component, OnInit } from "@angular/core";
import {
  audioAnalysisCategory,
  audioAnalysisMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-audio-analyses",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
class ListComponent extends PageComponent implements OnInit {
  public ngOnInit(): void {}
}

ListComponent.linkComponentToPageInfo({
  category: audioAnalysisCategory,
}).andMenuRoute(audioAnalysisMenuItem);

export { ListComponent };
