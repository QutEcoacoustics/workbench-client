import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import {
  MetaReviewFile,
  metaReviewIcons,
} from "@components/harvest/screens/metadata-review/metadata-review.component";
import { HarvestMapping } from "@models/Harvest";
import { HarvestItem, HarvestItemReport } from "@models/HarvestItem";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { NgClass, DecimalPipe } from "@angular/common";
import { WhitespaceComponent } from "./whitespace.component";

interface ValidationMessage {
  type: "warning" | "danger" | "error";
  message: string;
}

@Component({
  selector: "baw-meta-review-file-row",
  template: `
    <!-- Icon and Path -->
    <div class="grid-table-item">
      <!-- Whitespace -->
      <baw-meta-review-whitespace
        [indentation]="row.indentation"
      ></baw-meta-review-whitespace>
      <fa-icon class="me-2" [icon]="['fas', 'file']"></fa-icon>
      <small>{{ row.path }}</small>
      <span
        class="badge text-bg-secondary ms-3"
        [ngbTooltip]="(report.itemsSizeBytes | number) + ' bytes'"
      >
        {{ report.itemsSize }}
      </span>
    </div>

    <!-- Issues -->
    <div class="grid-table-item issues-extended">
      @if (harvestItem.hasItemsInvalid) {
        <div class="dropdown-icon">
          <fa-icon
            [icon]="['fas', row.showValidations ? 'chevron-up' : 'chevron-down']"
            (click)="row.showValidations = !row.showValidations"
          ></fa-icon>
        </div>
      }

      <div class="expander-wrapper">
        <div class="expander" [class.expand]="row.showValidations">
          <div class="content">
            @for (validation of validationMessages; track validation) {
              <small
                class="callout"
                [ngClass]="[getCalloutClass(validation)]"
              >
                {{ validation.message }}
              </small>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Issue icons -->
    <div class="grid-table-item">
      <div class="icon-wrapper">
        @if (harvestItem.hasItemsInvalidFixable) {
          <fa-icon class="text-warning" [icon]="icons.warningCircle"></fa-icon>
        }
        @if (harvestItem.hasItemsInvalidNotFixable) {
          <fa-icon class="text-danger" [icon]="icons.failureCircle"></fa-icon>
        }
        @if (!harvestItem.hasItemsInvalid) {
          <fa-icon class="text-success" [icon]="icons.successCircle"></fa-icon>
        }
        @if (harvestItem.hasItemsErrored) {
          <fa-icon class="text-black" [icon]="icons.errorCircle"></fa-icon>
        }
      </div>
    </div>
  `,
  styleUrl: "./file-row.component.scss",
  // Nothing in this component can change without a change in the row
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WhitespaceComponent,
    FaIconComponent,
    NgbTooltip,
    NgClass,
    DecimalPipe,
  ]
})
export class FileRowComponent implements OnInit {
  @Input() public row: MetaReviewFile;

  public validationMessages: ValidationMessage[];
  public icons = metaReviewIcons;

  public get mapping(): HarvestMapping {
    return this.row.mapping;
  }

  public get harvestItem(): HarvestItem {
    return this.row.harvestItem;
  }

  public get report(): HarvestItemReport {
    return this.harvestItem.report;
  }

  public ngOnInit(): void {
    this.validationMessages = [];

    this.harvestItem.validations?.forEach((validation) => {
      if (validation.status === "notFixable") {
        // Prepend non fixable messages to the start
        this.validationMessages.unshift({
          type: "danger",
          message: validation.message,
        });
      } else {
        // Append fixable messages to the end
        this.validationMessages.push({
          type: "warning",
          message: validation.message,
        });
      }
    });

    if (this.harvestItem.hasItemsErrored) {
      // Prepend error message to the start
      this.validationMessages.unshift({
        type: "error",
        message: "An unknown error has occurred",
      });
    }
  }

  public getCalloutClass(validation: ValidationMessage): string {
    return validation.type === "error"
      ? "callout-black"
      : `callout-${validation.type}`;
  }

  public toggleValidationMessages(row: MetaReviewFile): void {
    row.showValidations = !row.showValidations;
  }
}
