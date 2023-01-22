import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  MetaReviewFile,
  metaReviewIcons,
} from "@components/harvest/screens/metadata-review/metadata-review.component";
import { HarvestMapping } from "@models/Harvest";
import { HarvestItem, HarvestItemReport } from "@models/HarvestItem";
import { BehaviorSubject } from "rxjs";

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
      <small class="file-name">{{ row.path }}</small>
      <span
        class="badge text-bg-secondary ms-3"
        [ngbTooltip]="(report.itemsSizeBytes | number) + ' bytes'"
      >
        {{ report.itemsSize }}
      </span>
    </div>

    <!-- Issues -->
    <div class="grid-table-item issues-extended">
      <div
        *ngIf="
          harvestItem.hasItemsInvalid &&
          ((shouldShowChevron$ | async) || row.showValidations)
        "
        class="dropdown-icon"
      >
        <fa-icon
          [icon]="['fas', row.showValidations ? 'chevron-up' : 'chevron-down']"
          (click)="row.showValidations = !row.showValidations"
        ></fa-icon>
      </div>

      <div class="expander-wrapper">
        <div class="expander" [class.expand]="row.showValidations">
          <div #validationsContainer class="content">
            <small
              *ngFor="let validation of validationMessages"
              class="callout"
              [ngClass]="[getCalloutClass(validation)]"
            >
              {{ validation.message }}
              <ng-container *ngIf="updateChevronState(validationsContainer) || true"></ng-container>
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Issue icons -->
    <div class="grid-table-item">
      <div class="icon-wrapper">
        <fa-icon
          *ngIf="harvestItem.hasItemsInvalidFixable"
          class="text-warning"
          [icon]="icons.warningCircle"
        ></fa-icon>
        <fa-icon
          *ngIf="harvestItem.hasItemsInvalidNotFixable"
          class="text-danger"
          [icon]="icons.failureCircle"
        ></fa-icon>
        <fa-icon
          *ngIf="!harvestItem.hasItemsInvalid"
          class="text-success"
          [icon]="icons.successCircle"
        ></fa-icon>
        <fa-icon
          *ngIf="harvestItem.hasItemsErrored"
          class="text-black"
          [icon]="icons.errorCircle"
        ></fa-icon>
      </div>
    </div>
  `,
  styleUrls: ["file-row.component.scss"],
  // Nothing in this component can change without a change in the row
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileRowComponent implements OnInit, AfterViewInit {
  @Input() public row: MetaReviewFile;
  @ViewChild("validationsContainer")
  public validationsContainer: HTMLDivElement;

  public shouldShowChevron$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

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

  public ngAfterViewInit(): void {
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.updateChevronState(this.validationsContainer);
  }

  public getCalloutClass(validation: ValidationMessage): string {
    return validation.type === "error"
      ? "callout-black"
      : `callout-${validation.type}`;
  }

  public updateChevronState(container: HTMLDivElement): boolean {
    // if there is more than one validation or it is already expanded it can be known for certain that the validations can be expanded
    if (this.row.harvestItem.validations.length > 1) {
      this.shouldShowChevron$.next(true);
    }

    // to validate if the validation messages span multiple lines. Get the total height of the validation message container
    // and if it is larger than what the user can see, we can assert that the container is overflowing and needs a dropdown chevron
    this.shouldShowChevron$.next(container.scrollHeight > (container.clientHeight + 1));

    return true;
  }
}
