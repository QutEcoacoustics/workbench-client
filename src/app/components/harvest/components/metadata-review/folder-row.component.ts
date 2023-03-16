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
      <span class="folder-path">
        {{ row.path }}
      </span>
    </div>

    <!-- Create Mapping -->
    <div *ngIf="!viewMapping" class="grid-table-item create-mapping">
      <button
        *ngIf="hasHarvestItems"
        class="btn btn-sm btn-outline-primary"
        (click)="createMapping(row)"
      >
        Add Site or UTC to folder
      </button>
    </div>

    <ng-container *ngIf="viewMapping">
      <!-- Site Selector -->
      <div class="grid-table-item">
        <baw-loading
          *ngIf="viewMapping.site | isUnresolved; else siteSelector"
          size="sm"
        ></baw-loading>

        <ng-template #siteSelector>
          <baw-harvest-site-selector
            class="w-100"
            [project]="project"
            [site]="viewMapping.site"
            (siteIdChange)="setSite(mapping, $event)"
          ></baw-harvest-site-selector>
        </ng-template>
      </div>

      <!-- UTC Offset -->
      <div class="grid-table-item">
        <baw-harvest-utc-offset-selector
          class="w-100"
          [site]="viewMapping.site"
          [offset]="viewMapping.utcOffset"
          (offsetChange)="setOffset(mapping, $event)"
        ></baw-harvest-utc-offset-selector>
      </div>

      <!-- Recursive -->
      <div class="grid-table-item">
        <baw-checkbox
          class="w-100"
          [checked]="viewMapping.recursive"
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

  /**
   * The row mapping and the view mapping diverge because there are server side rules that define how mappings are inherited
   * These mappings however, should not be reflected in the models, but should be displayed to the user as inherited
   */
  public get viewMapping(): HarvestMapping {
    let currentFolder = this.row;

    // some folders such as the root folder do not have a parent folder. In this case, the current folder will be set to undefined, and
    // it can be concured that there is no mapping anywhere in the hierarchy
    while (!!currentFolder && !currentFolder?.mapping) {
      currentFolder = currentFolder?.parentFolder;
    }

    return currentFolder?.mapping;
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

  public createMapping(row: MetaReviewFolder, data?: Partial<HarvestMapping>): void {
    const mapping = new HarvestMapping(
      {
        path: this.row.isRoot ? this.row.path : this.row.harvestItem.path,
        recursive: data?.recursive ?? true,
        siteId: data?.siteId ?? null,
        utcOffset: data?.utcOffset ?? null,
      } as HarvestMapping,
      this.injector
    );
    row.mapping = mapping;
    this.harvest.mappings.push(mapping);
  }

  public setSite(mapping: HarvestMapping, siteId: number): void {
    if (!mapping) {
      this.createMapping(this.row, this.viewMapping);
    }

    mapping.siteId = siteId;
    this.mappingsChange.emit();
  }

  public setOffset(mapping: HarvestMapping, offset: string): void {
    if (!mapping) {
      this.createMapping(this.row, this.viewMapping);
    }

    mapping.utcOffset = offset;
    this.mappingsChange.emit();
  }

  public setIsRecursive(mapping: HarvestMapping, isRecursive: boolean): void {
    if (!mapping) {
      this.createMapping(this.row, this.viewMapping);
    }

    mapping.recursive = isRecursive;
    this.mappingsChange.emit();
  }
}
