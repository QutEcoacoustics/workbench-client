import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
} from "@angular/core";
import {
  MetaReviewFolder,
  metaReviewIcons,
} from "@components/harvest/screens/metadata-review/metadata-review.component";
import { Harvest, HarvestMapping } from "@models/Harvest";
import { HarvestItem, HarvestItemReport } from "@models/HarvestItem";
import { Project } from "@models/Project";

@Component({
  selector: "baw-meta-review-folder-row",
  template: `
    <!-- Icon and Path -->
    <div class="grid-table-item pointer" (click)="toggleFolder.emit()">
      <!-- Whitespace -->
      <baw-meta-review-whitespace
        [indentation]="row.indentation"
        [isFolder]="row.isOpen"
      ></baw-meta-review-whitespace>
      <fa-layers class="fa-custom-icon me-3" [fixedWidth]="true">
        <fa-icon
          [icon]="row.isOpen ? icons.folderOpen : icons.folderClosed"
        ></fa-icon>
        <fa-layers-counter
          *ngIf="!row.isRoot"
          class="text-light"
          [content]="report.itemsTotal ?? 0 | number"
          [classes]="['fa-custom-counter']"
        ></fa-layers-counter>
      </fa-layers>
      <span>
        {{ row.path }}
      </span>
    </div>

    <!-- Create Mapping -->
    <div *ngIf="!mapping" class="grid-table-item create-mapping">
      <button
        *ngIf="hasHarvestItems"
        class="btn btn-sm btn-outline-primary"
        (click)="createMapping(row)"
      >
        Add Site or UTC for folder
      </button>
    </div>

    <ng-container *ngIf="mapping">
      <!-- Site Selector -->
      <div class="grid-table-item">
        <baw-loading
          *ngIf="mapping.site | isUnresolved; else siteSelector"
          size="sm"
        ></baw-loading>

        <ng-template #siteSelector>
          <baw-harvest-site-selector
            class="w-100"
            [project]="project"
            [site]="mapping.site"
            (siteIdChange)="setSite(mapping, $event)"
          ></baw-harvest-site-selector>
        </ng-template>
      </div>

      <!-- UTC Offset -->
      <div class="grid-table-item">
        <baw-harvest-utc-offset-selector
          class="w-100"
          [site]="mapping.site"
          [offset]="mapping.utcOffset"
          (offsetChange)="setOffset(mapping, $event)"
        ></baw-harvest-utc-offset-selector>
      </div>

      <!-- Recursive -->
      <div class="grid-table-item">
        <baw-checkbox
          class="w-100"
          [checked]="mapping.recursive"
          (checkedChange)="setIsRecursive(mapping, $event)"
        ></baw-checkbox>
      </div>
    </ng-container>

    <!-- Issue Icons -->
    <div class="grid-table-item">
      <div *ngIf="!row.isRoot" class="icon-wrapper">
        <span
          *ngIf="harvestItem.hasItemsInvalidFixable"
          class="badge text-bg-warning pointer"
          (click)="toggleFolder.emit()"
        >
          <fa-icon [icon]="icons.warning"></fa-icon>
          {{ report.itemsInvalidFixable | number }}
        </span>
        <span
          *ngIf="harvestItem.hasItemsInvalidNotFixable"
          class="badge text-bg-danger text-light pointer"
          (click)="toggleFolder.emit()"
        >
          <fa-icon [icon]="icons.failure"></fa-icon>
          {{ report.itemsInvalidNotFixable | number }}
        </span>
        <span
          *ngIf="harvestItem.hasItemsErrored"
          class="badge text-bg-dark pointer"
          (click)="toggleFolder.emit()"
        >
          <fa-icon [icon]="icons.errorCircle"></fa-icon>
          {{ report.itemsErrored | number }}
        </span>
        <fa-icon
          *ngIf="!row.harvestItem.hasItemsInvalid"
          class="text-success pointer"
          [icon]="['fas', 'circle-check']"
          (click)="toggleFolder.emit()"
        ></fa-icon>
      </div>
    </div>
  `,
  styleUrls: ["folder-row.component.scss"],
})
export class FolderRowComponent {
  @Input() public harvest: Harvest;
  @Input() public project: Project;
  @Input() public row: MetaReviewFolder;
  /** Triggers when this folder is opened/closed */
  @Output() public toggleFolder = new EventEmitter<void>();
  @Output() public mappingsChange = new EventEmitter<void>();

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

  public get hasHarvestItems(): boolean {
    return !this.mapping && !(this.row.isRoot && !+this.row.harvestItem);
  }

  public constructor(private injector: Injector) {}

  public createMapping(row: MetaReviewFolder): void {
    const mapping = new HarvestMapping(
      {
        // Root folder is not a harvest item, so root folder row does not have
        // a harvest item
        path: row.isRoot ? row.path : row.harvestItem.path,
        recursive: true,
        siteId: null,
        utcOffset: null,
      },
      this.injector
    );
    row.mapping = mapping;
    this.harvest.mappings.push(mapping);
  }

  public setSite(mapping: HarvestMapping, siteId: number): void {
    mapping.siteId = siteId;
    this.mappingsChange.emit();
  }

  public setOffset(mapping: HarvestMapping, offset: string): void {
    mapping.utcOffset = offset;
    this.mappingsChange.emit();
  }

  public setIsRecursive(mapping: HarvestMapping, isRecursive: boolean): void {
    mapping.recursive = isRecursive;
    this.mappingsChange.emit();
  }
}
