import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from "@angular/core";
import { Harvest, HarvestMapping } from "@models/Harvest";
import { HarvestItem, HarvestItemReport } from "@models/HarvestItem";
import { AssociationInjector } from "@models/ImplementsInjector";
import { Project } from "@models/Project";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { FaLayersComponent, FaIconComponent, FaLayersCounterComponent } from "@fortawesome/angular-fontawesome";
import { DecimalPipe } from "@angular/common";
import { LoadingComponent } from "@shared/loading/loading.component";
import { CheckboxComponent } from "@shared/checkbox/checkbox.component";
import { MetaReviewFolder, metaReviewIcons } from "@components/harvest/screens/metadata-review/metadata-review.types";
import { SiteSelectorComponent } from "../inputs/site-selector.component";
import { UTCOffsetSelectorComponent } from "../inputs/utc-offset-selector.component";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";
import { WhitespaceComponent } from "./whitespace.component";

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
        @if (!row.isRoot) {
        <fa-layers-counter
          class="text-light fa-custom-counter"
          [content]="report.itemsTotal ?? 0 | number"
        ></fa-layers-counter>
        }
      </fa-layers>
      <span>
        {{ row.path }}
      </span>
    </div>

    <!-- Create Mapping -->
    @if (!mapping) {
    <div class="grid-table-item create-mapping">
      <button
        class="btn btn-sm btn-outline-primary"
        (click)="createMapping(row)"
      >
        Change Site or UTC for folder
      </button>
    </div>
    } @if (mapping) {
    <!-- Site Selector -->
    <div class="grid-table-item">
      @if (mapping.site | isUnresolved) {
      <baw-loading size="sm"></baw-loading>
      } @else {
      <baw-harvest-site-selector
        class="w-100"
        [project]="project"
        [site]="mapping.site"
        (siteIdChange)="setSite(mapping, $event)"
      ></baw-harvest-site-selector>
      }
    </div>

    <!-- UTC Offset -->
    <div class="grid-table-item">
      <baw-harvest-utc-offset-selector
        class="w-100"
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
    }

    <!-- Issue Icons -->
    <div class="grid-table-item">
      @if (!row.isRoot) {
      <div class="icon-wrapper">
        @if (harvestItem.hasItemsInvalidFixable) {
        <span
          class="badge text-bg-warning pointer"
          (click)="toggleFolder.emit()"
        >
          <fa-icon [icon]="icons.warning"></fa-icon>
          {{ report.itemsInvalidFixable | number }}
        </span>
        } @if (harvestItem.hasItemsInvalidNotFixable) {
        <span
          class="badge text-bg-danger text-light pointer"
          (click)="toggleFolder.emit()"
        >
          <fa-icon [icon]="icons.failure"></fa-icon>
          {{ report.itemsInvalidNotFixable | number }}
        </span>
        } @if (harvestItem.hasItemsErrored) {
        <span class="badge text-bg-dark pointer" (click)="toggleFolder.emit()">
          <fa-icon [icon]="icons.errorCircle"></fa-icon>
          {{ report.itemsErrored | number }}
        </span>
        } @if (!row.harvestItem.hasItemsInvalid) {
        <fa-icon
          class="text-success pointer"
          [icon]="['fas', 'circle-check']"
          (click)="toggleFolder.emit()"
        ></fa-icon>
        }
      </div>
      }
    </div>
  `,
  styleUrl: "folder-row.component.scss",
  imports: [
    WhitespaceComponent,
    FaLayersComponent,
    FaIconComponent,
    FaLayersCounterComponent,
    LoadingComponent,
    SiteSelectorComponent,
    UTCOffsetSelectorComponent,
    CheckboxComponent,
    DecimalPipe,
    IsUnresolvedPipe,
  ],
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

  public constructor(
    @Inject(ASSOCIATION_INJECTOR) protected injector: AssociationInjector
  ) {}

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
