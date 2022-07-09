import { Component, OnInit } from "@angular/core";
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
import { Harvest, HarvestMapping } from "@models/Harvest";
import { HarvestItem } from "@models/HarvestItem";
import { Project } from "@models/Project";
import { ConfigService } from "@services/config/config.service";
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
  /** Changes to harvest have not yet been saved to the server */
  public hasUnsavedChanges: boolean;
  public newSiteMenuItem = newSiteMenuItem;
  public rows: List<MetaReviewRow>;
  public siteColumnLabel: "Point" | "Site";
  public statistics: Statistic[][];
  /** Table is loading new data */
  public tableLoading: boolean;

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
    private harvestItemsApi: HarvestItemsService
  ) {
    super();
  }

  public get project(): Project {
    return this.stages.project;
  }

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  public get transitioningStage(): boolean {
    return this.stages.transitioningStage;
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

  /**
   * Toggle a folder between opened and closed
   *
   * @param index Row index of folder
   */
  public toggleFolder(index: number): void {
    const row = this.rows.get(index) as MetaReviewFolder;
    if (row.isOpen) {
      this.closeFolder(index);
    } else {
      this.loadMore(index);
    }
    row.isOpen = !row.isOpen;
  }

  /**
   * Load more harvest items for the folder, and create table rows for them. If
   * the folder has more harvest items left, this will also create a load more
   * row
   *
   * @param index Row index of folder
   */
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
          newRows.push(this.generateLoadMore(parentFolder, row.page + 1));
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

  /** Transition harvest to processing stage */
  public onNextClick(): void {
    this.stages.transition("processing");
  }

  /** Transition harvest to uploading stage */
  public onBackClick(): void {
    this.stages.transition("uploading");
  }

  /** Transition harvest to meta extraction stage */
  public onSaveClick(): void {
    this.stages.transition("metadataExtraction");
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

  public trackByRow = (_: number, row: MetaReviewRow): string =>
    (row as MetaReviewFolder).isRoot
      ? (row as MetaReviewFolder).path
      : row.harvestItem?.path;

  public updateHarvestWithMappingChange(): void {
    const mappings: HarvestMapping[] = [];

    /*
     * Iterate through all the rows, extract folders which have mappings and
     * push that list to the mappings array. We could use a filter and map for
     * this, however it's likely less performant
     */
    this.rows.forEach((row): void => {
      if (row.rowType === RowType.folder && isInstantiated(row.mapping)) {
        mappings.push(row.mapping);
      }
    });

    this.hasUnsavedChanges = true;
    this.harvestApi
      .updateMappings(this.harvest, mappings)
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe({
        next: (): void => {
          this.hasUnsavedChanges = false;
        },
        error: (err: BawApiError) =>
          this.notification.error("Failed to make that change: " + err.message),
      });
  }

  /**
   * Close a folder, removing its children (and grandchildren) from the table
   * rows
   *
   * @param index Row index of folder
   */
  private closeFolder(index: number): void {
    /**
     * Check if the parent, or ancestors, of the child row match the parent
     * folder
     *
     * @param parent Parent folder to match against
     * @param child Child row to check
     */
    function isChild(parent: MetaReviewFolder, child: MetaReviewRow): boolean {
      let lineage = child?.parentFolder;
      while (isInstantiated(lineage) && lineage !== parent) {
        lineage = lineage.parentFolder;
      }
      return lineage === parent;
    }

    const row = this.rows.get(index) as MetaReviewFolder;

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

  /**
   * Generate a load more row
   *
   * @param parentFolder Parent folder
   * @param page Page of folder to load
   */
  private generateLoadMore(
    parentFolder: MetaReviewFolder | null,
    page: number
  ): MetaReviewLoadMore {
    return {
      rowType: RowType.loadMore,
      harvestItem: parentFolder.harvestItem,
      mapping: parentFolder.mapping,
      page,
      parentFolder,
      isLoading: false,
    };
  }

  /**
   * Generate a file or folder row
   *
   * @param harvestItem Harvest item
   * @param parentFolder Parent folder
   */
  private generateRow(
    harvestItem: HarvestItem,
    parentFolder: MetaReviewFolder
  ): MetaReviewFolder | MetaReviewFile {
    const mapping = this.findMapping(this.harvest, harvestItem);
    // While it is technically possible in linux to have filenames which
    // include the character '/', our server should block it from being used
    // and bad actors will gain nothing from taking advantage of it
    const paths = harvestItem.path.split("/");
    // Indentation is the number of '/' characters, plus the root folder (which
    // uses '' instead of '/')
    const indentation = paths.length;
    const filename = paths.pop();
    const baseData = {
      harvestItem,
      mapping,
      path: filename,
      indentation: Array(indentation),
    };

    if (harvestItem.isDirectory) {
      return {
        rowType: RowType.folder,
        isOpen: false,
        page: 1,
        parentFolder,
        isRoot: false,
        ...baseData,
      } as MetaReviewFolder;
    } else {
      return {
        rowType: RowType.file,
        parentFolder,
        showValidations: false,
        ...baseData,
      } as MetaReviewFile;
    }
  }

  /**
   * Find mapping if exists in the harvest model, using the harvest items path
   *
   * @param harvest Harvest
   * @param harvestItem Harvest Item
   */
  private findMapping(
    harvest: Harvest,
    harvestItem: HarvestItem
  ): HarvestMapping | null {
    return harvest.mappings.find(
      (_mapping): boolean => harvestItem.path === _mapping.path
    );
  }

  /**
   * Get harvest statistics
   *
   * @param harvest Harvest to generate statistics for
   */
  private getStatistics(harvest: Harvest): Statistic[][] {
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
}
