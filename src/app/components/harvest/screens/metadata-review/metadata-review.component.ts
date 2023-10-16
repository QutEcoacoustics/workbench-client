import { Component, OnInit } from "@angular/core";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { Statistic } from "@components/harvest/components/shared/statistics/statistics.component";
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
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfigService } from "@services/config/config.service";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { concatMap, Subject, takeUntil, tap } from "rxjs";

enum RowType {
  folder,
  file,
  loadMore,
}

export const metaReviewIcons = {
  folderOpen: ["fas", "folder-open"] as IconProp,
  folderClosed: ["fas", "folder-closed"] as IconProp,
  successCircle: ["fas", "circle-check"] as IconProp,
  success: ["fas", "check"] as IconProp,
  warningCircle: ["fas", "circle-exclamation"] as IconProp,
  warning: ["fas", "triangle-exclamation"] as IconProp,
  failureCircle: ["fas", "xmark-circle"] as IconProp,
  failure: ["fas", "xmark"] as IconProp,
  errorCircle: ["fas", "xmark-circle"] as IconProp,
  error: ["fas", "xmark"] as IconProp,
};

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

export type Rows = List<MetaReviewRow>;

const rootMappingPath = "";

/**
 * TODO Potential quality of life changes:
 * - Show/hide successful files/folders
 * - Wrap table in virtual scroll
 */
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
  public rows: Rows = List<MetaReviewRow>([]);
  public siteColumnLabel: "Point" | "Site";
  public statistics: Statistic[][];
  /** Table is loading new data */
  public tableLoading: boolean;

  private userInputBuffer$ = new Subject<
    MetaReviewFolder | MetaReviewLoadMore
  >();

  public icons = metaReviewIcons;

  public constructor(
    public modals: NgbModal,
    private stages: HarvestStagesService,
    private config: ConfigService,
    private notification: ToastrService,
    private harvestApi: ShallowHarvestsService
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
    this.statistics = this.getStatistics(this.harvest);

    const rootFolder: MetaReviewFolder = {
      rowType: RowType.folder,
      isRoot: true,
      indentation: [],
      isOpen: false,
      page: 1,
      path: rootMappingPath,
      parentFolder: null,
      // Root folder does not have harvestItem, use hard-coded path for search
      mapping: this.harvest.mappings.find(
        (mapping) => mapping.path === rootMappingPath
      ),
    };

    this.rows = List<MetaReviewRow>([rootFolder]);

    /*
     * This buffers user inputs so that only one input is executed at a time.
     * We are inserting/deleting rows, so the user inputs are dependant on the
     * state of the previous input (as the row they clicked on may have moved).
     */
    this.userInputBuffer$
      .pipe(
        concatMap(async (row): Promise<Rows> => {
          let rows = this.rows;
          // Find the current index of the row (this may be different from when
          // the user clicked on the button)
          const index = rows.findIndex((_row): boolean => _row === row);

          // Load more button clicked, load next page of results
          if (this.isLoadMore(row)) {
            return await this.loadMore(rows, index, row);
          }

          if (row.isOpen) {
            // Open folder clicked, close folder, and remove children rows
            rows = this.closeFolder(rows, index, row);
          } else {
            // Closed folder clicked, load first page of children
            rows = await this.loadMore(rows, index, row);
          }
          row.isOpen = !row.isOpen;
          return rows;
        }),
        tap((rows): void => {
          this.rows = rows;
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe();

    this.toggleRow(rootFolder);
  }

  public toggleRow(row: MetaReviewFolder | MetaReviewLoadMore): void {
    this.userInputBuffer$.next(row);
  }

  public async processing(template: any): Promise<void> {
    const ref = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (success) {
      this.stages.transition("processing");
    }
  }

  public async upload(template: any): Promise<void> {
    const ref = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (success) {
      this.stages.transition("uploading");
    }
  }

  public async extraction(template: any): Promise<void> {
    const ref = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (success) {
      this.stages.transition("metadataExtraction");
    }
  }

  public async abortUpload(template: any): Promise<void> {
    const ref = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (success) {
      this.stages.transition("complete");
    }
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
    // create a new "temporary" model of the Harvest mappings
    const newMappings = new Map(this.harvest.mappings.map((x) => [x.path, x]));

    /**
     * Iterate through all the rows, extract folders which have mappings and
     * push that list to the mappings array. We could use a filter and map for
     * this, however it's likely less performant
     */
    this.rows.forEach((row): void => {
      if (row.rowType === RowType.folder && isInstantiated(row.mapping)) {
        const rowMapping = row.mapping;
        const existing = newMappings.get(rowMapping.path);

        if (existing) {
          Object.assign(existing, rowMapping);
        } else {
          newMappings.set(rowMapping.path, rowMapping);
        }
      }
    });

    const adjustedMappings = Array.from(newMappings.values());

    this.hasUnsavedChanges = true;
    this.harvestApi
      .updateMappings(this.harvest, adjustedMappings)
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe({
        next: (harvest: Harvest): void => {
          this.stages.setHarvest(harvest);
          this.hasUnsavedChanges = false;

          // update the wider Harvest model once the baw-api PATCH request was accepted
          this.harvest.mappings = adjustedMappings;
        },
        error: (err: BawApiError) =>
          this.notification.error("Failed to make that change: " + err.message),
      });
  }

  /**
   * Load more harvest items for the folder, and create table rows for them. If
   * the folder has more harvest items left, this will also create a load more
   * row
   *
   * @param row Table row
   */
  private async loadMore(
    rows: Rows,
    rowIndex: number,
    row: MetaReviewFolder | MetaReviewLoadMore
  ): Promise<Rows> {
    this.tableLoading = true;
    const harvestItems = await this.stages.getHarvestItems(
      row.harvestItem,
      row.page
    );
    this.tableLoading = false;

    if (harvestItems.length === 0) {
      return rows;
    }

    const parentFolder = this.isFolder(row) ? row : row.parentFolder;
    const newRows = harvestItems.map(
      (harvestItem): MetaReviewRow =>
        this.generateRow(harvestItem, parentFolder)
    );

    const meta = harvestItems[0].getMetadata();
    if (meta && meta.paging.maxPage !== meta.paging.page) {
      newRows.push(this.generateLoadMore(parentFolder, row.page + 1));
    }

    if (this.isFolder(row)) {
      // Insert elements after row without replacing anything
      const firstChildIndex = rowIndex + 1;
      rows = rows.splice(firstChildIndex, 0, ...newRows);
    } else {
      // Insert elements replace load more row
      rows = rows.splice(rowIndex, 1, ...newRows);
    }
    return rows;
  }

  /**
   * Close a folder, removing its children (and grandchildren) from the table
   * rows
   *
   * @param row Table row
   */
  private closeFolder(
    rows: Rows,
    rowIndex: number,
    row: MetaReviewFolder
  ): Rows {
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

    // Find any children, and increment offset
    let offset = 1;
    let currRow = rows.get(rowIndex + offset);
    while (isChild(row, currRow)) {
      offset++;
      currRow = rows.get(rowIndex + offset);
    }

    // Remove final row from list as it is not a child
    offset--;

    // If no children, don't delete anything
    if (offset === 0) {
      return;
    }

    // Remove all children
    const firstChildIndex = rowIndex + 1;
    return rows.splice(firstChildIndex, offset);
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
