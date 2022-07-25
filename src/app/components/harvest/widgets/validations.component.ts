import { Component, OnInit } from "@angular/core";
import { contactUsMenuItem } from "@components/about/about.menus";
import { WidgetComponent } from "@menu/widget.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { ValidationName } from "@models/HarvestItem";
import { map, Observable, startWith } from "rxjs";
import { HarvestStagesService } from "../services/harvest-stages.service";

@Component({
  selector: "baw-harvest-issue-widget",
  templateUrl: "validations.component.html",
  styles: [
    `
      hr {
        margin: 1rem -1rem;
      }

      p {
        font-size: 0.85em;
      }

      #attention-file-title {
        border-bottom: 2px solid hsl(var(--baw-warning-hsl));
      }

      #problem-file-title {
        border-bottom: 2px solid hsl(var(--baw-danger-hsl));
      }
    `,
  ],
})
export class ValidationsWidgetComponent implements WidgetComponent, OnInit {
  public contactUs = contactUsMenuItem;
  public isMetaReviewStage$: Observable<boolean>;

  public constructor(private stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.isMetaReviewStage$ = this.stages.harvest$.pipe(
      startWith(false),
      map((): boolean => this.stages.isCurrentStage("metadataReview"))
    );
  }

  public hasError(error: ValidationName): boolean {
    return this.stages.harvestItemErrors.has(error);
  }

  public get showFixableIssues(): boolean {
    return !!this.stages.hasHarvestItemsFixable;
  }

  public get showNonFixableIssues(): boolean {
    return !!this.stages.hasHarvestItemsNotFixable;
  }

  public get corruptedFile(): boolean {
    return (
      this.hasError("fileEmpty") ||
      this.hasError("noDuration") ||
      this.hasError("tooShort") ||
      this.hasError("channelCount") ||
      this.hasError("sampleRate") ||
      this.hasError("bitRate") ||
      this.hasError("mediaType")
    );
  }
}

export const harvestValidationsWidgetMenuItem = new WidgetMenuItem(
  ValidationsWidgetComponent
);
