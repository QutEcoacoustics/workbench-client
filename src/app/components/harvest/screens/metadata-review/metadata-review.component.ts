import { Component, Injector, OnInit } from "@angular/core";
import { HarvestItemsService } from "@baw-api/harvest/harvest-items.service";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { Statistic } from "@components/harvest/components/shared/statistics.component";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { newSiteMenuItem } from "@components/sites/sites.menus";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { toRelative } from "@interfaces/apiInterfaces";
import { Harvest, HarvestMapping, HarvestStatus } from "@models/Harvest";
import { HarvestItem } from "@models/HarvestItem";
import { Project } from "@models/Project";
import { ConfigService } from "@services/config/config.service";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { first, takeUntil } from "rxjs";

enum RowType {
  folder,
  file,
  loadMore,
}

export interface MetaReviewBase {
  rowType: RowType;
  harvestItem?: HarvestItem;
  /**
   * Row Mapping, if unset, this row will not be included in the mappings sent
   * to the server
   */
  mapping?: HarvestMapping;
}

export interface MetaReviewItem extends MetaReviewBase {
  path: string;
  parentFolder?: MetaReviewFolder;
  indentation: Array<void>;
}

export interface MetaReviewFile extends MetaReviewItem {
  rowType: RowType.file;
  showValidations: boolean;
}

export interface MetaReviewFolder extends MetaReviewItem {
  rowType: RowType.folder;
  isOpen: boolean;
  page: number;
  isRoot: boolean;
}

export interface MetaReviewLoadMore extends MetaReviewBase {
  rowType: RowType.loadMore;
  parentFolder?: MetaReviewFolder;
  page: number;
  isLoading: boolean;
}

export type MetaReviewRow =
  | MetaReviewFile
  | MetaReviewFolder
  | MetaReviewLoadMore;

const rootMappingPath = "";

@Component({
  selector: "baw-harvest-metadata-review",
  templateUrl: "metadata-review.component.html",
  styleUrls: ["metadata-review.component.scss"],
})
export class MetadataReviewComponent
  extends withUnsubscribe()
  implements OnInit, UnsavedInputCheckingComponent
{
  public newSiteMenuItem = newSiteMenuItem;
  public statistics: Statistic[][];

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public RowType = RowType;

  public rows: List<MetaReviewRow>;
  /** List of harvest items, indexes must match mappings */
  public harvestItems: HarvestItem[];
  /** List of mappings, indexes must match harvestItems */
  public mappings: HarvestMapping[];
  public loading: boolean;
  public tableLoading: boolean;
  public hasUnsavedChanges: boolean;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ColumnMode = ColumnMode;
  public siteColumnLabel: string;
  public icons = {
    successCircle: ["fas", "circle-check"] as IconProp,
    success: ["fas", "check"] as IconProp,
    warningCircle: ["fas", "circle-exclamation"] as IconProp,
    warning: ["fas", "triangle-exclamation"] as IconProp,
    failureCircle: ["fas", "xmark-circle"] as IconProp,
    failure: ["fas", "xmark"] as IconProp,
    errorCircle: ["fas", "xmark-circle"] as IconProp,
    error: ["fas", "xmark"] as IconProp,
  };

  public constructor(
    private stages: HarvestStagesService,
    private config: ConfigService,
    private notification: ToastrService,
    private harvestApi: ShallowHarvestsService,
    private harvestItemsApi: HarvestItemsService,
    private injector: Injector
  ) {
    super();
  }

  public get project(): Project {
    return this.stages.project;
  }

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  public ngOnInit(): void {
    this.siteColumnLabel = this.config.settings.hideProjects ? "Point" : "Site";
    this.statistics = this.getStatistics(this.stages.harvest);

    const rootFolder: MetaReviewFolder = {
      rowType: RowType.folder,
      isRoot: true,
      indentation: [],
      isOpen: true,
      page: 1,
      path: rootMappingPath,
      parentFolder: null,
    };

    this.rows = List<MetaReviewRow>([rootFolder]);
    this.loadMore(0);
  }

  public getStatistics(harvest: Harvest): Statistic[][] {
    const report = harvest.report;
    return [
      [
        {
          bgColor: "success",
          icon: ["fas", "folder-tree"],
          label: "Total Files",
          value: report.itemsTotal.toLocaleString(),
        },
      ],
      [
        {
          bgColor: "success",
          icon: ["fas", "hard-drive"],
          label: "Total Size",
          value: report.itemsSize,
          tooltip: report.itemsSizeBytes.toLocaleString() + " bytes",
        },
      ],
      [
        {
          bgColor: "success",
          icon: ["fas", "clock"],
          label: "Total Duration",
          value: toRelative(report.itemsDuration, {
            largest: 1,
            maxDecimalPoint: 0,
          }),
          tooltip: report.itemsDurationSeconds.toLocaleString() + " seconds",
        },
      ],
      [
        {
          bgColor: "warning",
          icon: this.icons.warning,
          label: "Need Attention",
          value: report.itemsInvalidFixable.toLocaleString(),
        },
        {
          color: "light",
          bgColor: "danger",
          icon: this.icons.failure,
          label: "Problems",
          value: report.itemsInvalidNotFixable.toLocaleString(),
        },
      ],
    ];
  }

  public getHarvestItem(index: number): HarvestItem {
    return this.harvestItems[index];
  }

  public toggleFolder(index: number): void {
    const row = this.rows.get(index) as MetaReviewFolder;
    if (row.isOpen) {
      this.closeFolder(index);
    } else {
      row.isOpen = true;
      this.loadMore(index);
    }
  }

  public loadMore(index: number): void {
    const row = this.rows.get(index) as MetaReviewFolder | MetaReviewLoadMore;
    this.tableLoading = true;

    this.harvestItemsApi
      .listByPage(row.page, this.project, this.harvest, row.harvestItem)
      .pipe(first(), takeUntil(this.unsubscribe))
      .subscribe((harvestItems): void => {
        const parentFolder: MetaReviewFolder = this.isFolder(row)
          ? row
          : row.parentFolder;
        const newRows = harvestItems.map(
          (harvestItem): MetaReviewRow =>
            this.generateRow(harvestItem, parentFolder)
        );

        const meta = harvestItems[0]?.getMetadata();
        if (meta && meta.paging.maxPage !== meta.paging.page) {
          newRows.push(this.generateLoadMore(row, parentFolder));
        }

        if (this.isFolder(row)) {
          // Insert elements after row without replacing anything
          const firstChildIndex = index + 1;
          this.rows = this.rows.splice(firstChildIndex, 0, ...newRows);
        } else {
          // Insert elements replace load more row
          this.rows = this.rows.splice(index, 1, ...newRows);
        }
        this.tableLoading = false;
      });
  }

  public closeFolder(index: number): void {
    function isChild(parent: MetaReviewFolder, child: MetaReviewRow): boolean {
      let lineage = child?.parentFolder;
      while (isInstantiated(lineage) && lineage !== parent) {
        lineage = lineage.parentFolder;
      }
      return lineage === parent;
    }

    const row = this.rows.get(index) as MetaReviewFolder;
    row.isOpen = false;

    // Find any children, and increment offset
    let offset = 1;
    let currRow = this.rows.get(index + offset);
    while (isChild(row, currRow)) {
      offset++;
      currRow = this.rows.get(index + offset);
    }

    // Remove final row from list as it is not a child
    offset--;

    // If no children, don't delete anything
    if (offset === 0) {
      return;
    }

    // Remove all children
    const firstChildIndex = index + 1;
    this.rows = this.rows.splice(firstChildIndex, offset);
  }

  public onNextClick(): void {
    this.transition("processing");
  }

  public onBackClick(): void {
    this.transition("uploading");
  }

  public onSaveClick(): void {
    this.transition("metadataExtraction");
  }

  private transition(stage: HarvestStatus): void {
    this.loading = true;
    this.stages.transition(stage, () => (this.loading = false));
  }

  public isFolder(row: MetaReviewRow): row is MetaReviewFolder {
    return row.rowType === RowType.folder;
  }

  public isFile(row: MetaReviewRow): row is MetaReviewFile {
    return row.rowType === RowType.file;
  }

  public isLoadMore(row: MetaReviewRow): row is MetaReviewLoadMore {
    return row.rowType === RowType.loadMore;
  }

  public getValidationMessages(
    row: MetaReviewFolder | MetaReviewFile
  ): { type: string; message: string }[] {
    // TODO Sort to make nonfixable errors on top
    const messages = (row.harvestItem.validations ?? []).map((validation) => ({
      type: validation.status === "fixable" ? "warning" : "danger",
      message: validation.message,
    }));

    if (this.hasItemsErrored(row)) {
      messages.unshift({
        type: "error",
        message: "An unknown error has occurred",
      });
    }

    return messages;
  }

  public toggleValidationMessages(
    row: MetaReviewFile | MetaReviewFolder
  ): void {
    if (this.isFile(row)) {
      row.showValidations = !row.showValidations;
    }
  }

  public hasItemsInvalidFixable(row: MetaReviewRow): boolean {
    return row.harvestItem?.report.itemsInvalidFixable > 0;
  }

  public hasItemsInvalidNotFixable(row: MetaReviewRow): boolean {
    return row.harvestItem?.report.itemsInvalidNotFixable > 0;
  }

  public hasItemsErrored(row: MetaReviewRow): boolean {
    return row.harvestItem?.report.itemsErrored > 0;
  }

  public hasItemsInvalid(row: MetaReviewRow): boolean {
    return (
      this.hasItemsInvalidFixable(row) ||
      this.hasItemsInvalidNotFixable(row) ||
      this.hasItemsErrored(row)
    );
  }

  public createMapping(row: MetaReviewFolder): void {
    const mapping = new HarvestMapping(
      {
        // Root folder does not have a harvest item
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

  public trackByRow = (_: number, row: MetaReviewRow): string =>
    (row as MetaReviewFolder).isRoot
      ? (row as MetaReviewFolder).path
      : row.harvestItem?.path;

  private findMapping(
    harvest: Harvest,
    harvestItem: HarvestItem
  ): HarvestMapping | null {
    const mapping = harvest.mappings.find(
      (_mapping): boolean => harvestItem.path === _mapping.path
    );
    return mapping;
  }

  private generateLoadMore(
    parentRow: MetaReviewFolder | MetaReviewLoadMore | null,
    parentFolder: MetaReviewFolder | null
  ): MetaReviewLoadMore {
    return {
      rowType: RowType.loadMore,
      harvestItem: parentRow.harvestItem,
      mapping: parentRow.mapping,
      page: parentRow.page + 1,
      parentFolder,
      isLoading: false,
    };
  }

  private generateRow(
    harvestItem: HarvestItem,
    parentRow: MetaReviewFolder
  ): MetaReviewRow {
    const mapping = this.findMapping(this.harvest, harvestItem);
    // While it is technically possible in linux to have filenames which
    // include the character '/', our server should block it from being used
    // and bad actors will gain nothing from taking advantage of it
    const paths = harvestItem.path.split("/");
    // Indentation is the number of '/' characters, plus the root folder
    const indentation = paths.length;
    const filename = paths.pop();

    if (harvestItem.isDirectory) {
      return {
        rowType: RowType.folder,
        harvestItem,
        isOpen: false,
        mapping,
        page: 1,
        path: filename,
        parentFolder: parentRow,
        indentation: Array(indentation),
        isRoot: false,
      } as MetaReviewFolder;
    } else {
      return {
        rowType: RowType.file,
        harvestItem,
        mapping,
        path: filename,
        parentFolder: parentRow,
        indentation: Array(indentation),
        showValidations: false,
      } as MetaReviewFile;
    }
  }

  public updateHarvestWithMappingChange(): void {
    this.hasUnsavedChanges = true;
    this.harvestApi
      .updateMappings(
        this.harvest,
        this.rows
          .filter((row) => row.rowType === RowType.folder && row.mapping)
          .map((row) => row.mapping)
          .toArray()
      )
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe({
        next: (): void => {
          this.stages.reloadModel();
          this.hasUnsavedChanges = false;
        },
        error: (err: BawApiError) =>
          this.notification.error("Failed to make that change: " + err.message),
      });
  }
}
