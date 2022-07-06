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
import { Id, toRelative } from "@interfaces/apiInterfaces";
import { Harvest, HarvestMapping, HarvestStatus } from "@models/Harvest";
import { HarvestItem } from "@models/HarvestItem";
import { Project } from "@models/Project";
import { ConfigService } from "@services/config/config.service";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs";

enum RowType {
  folder,
  file,
  loadMore,
}

interface Base {
  rowType: RowType;
  harvestItem: HarvestItem;
  mapping: HarvestMapping;
}

interface Item extends Base {
  path: string;
  parentFolder?: Folder;
  indentation: number;
}

interface File extends Item {
  rowType: RowType.file;
  showValidations: boolean;
}

interface Folder extends Item {
  rowType: RowType.folder;
  isOpen: boolean;
  page: number;
  siteId: Id;
  utcOffset: string;
  recursive: boolean;
}

interface LoadMore extends Base {
  rowType: RowType.loadMore;
  parentFolder?: Folder;
  page: number;
  isLoading: boolean;
}

type Row = File | Folder | LoadMore;

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

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public RowType = RowType;

  public rows = List<Row>();
  /** List of harvest items, indexes must match mappings */
  public harvestItems: HarvestItem[];
  /** List of mappings, indexes must match harvestItems */
  public mappings: HarvestMapping[];
  public loading: boolean;
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

    this.harvestItemsApi
      .list(this.project, this.harvest)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((harvestItems): void => {
        this.harvestItems = harvestItems;
        this.rows = List(
          this.harvestItems.map(
            (harvestItem): Row => this.generateRow(harvestItem, null, 1)
          )
        );
      });
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
    const row = this.rows.get(index) as Folder;
    if (row.isOpen) {
      this.closeFolder(index);
    } else {
      row.isOpen = true;
      this.loadMore(index);
    }
  }

  public loadMore(index: number): void {
    const row = this.rows.get(index) as Folder | LoadMore;

    if (this.isLoadMore(row)) {
      row.isLoading = true;
    }

    this.harvestItemsApi
      .listByPage(row.page, this.project, this.harvest, row.harvestItem)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((harvestItems): void => {
        const parentFolder: Folder = this.isFolder(row)
          ? row
          : row.parentFolder;
        const newRows = harvestItems.map(
          (harvestItem): Row =>
            this.generateRow(harvestItem, parentFolder, row.page + 1)
        );

        const meta = harvestItems[0]?.getMetadata();
        if (meta && meta.paging.maxPage !== meta.paging.page) {
          newRows.push({
            rowType: RowType.loadMore,
            harvestItem: row.harvestItem,
            mapping: row.mapping,
            page: row.page + 1,
            parentFolder,
            isLoading: false,
          } as LoadMore);
        }

        if (this.isFolder(row)) {
          // Insert elements after row without replacing anything
          const firstChildIndex = index + 1;
          this.rows = this.rows.splice(firstChildIndex, 0, ...newRows);
        } else {
          // Insert elements replace load more row
          this.rows = this.rows.splice(index, 1, ...newRows);
        }
      });
  }

  public closeFolder(index: number): void {
    function isChild(parent: Folder, child: Row): boolean {
      let lineage = child?.parentFolder;
      while (isInstantiated(lineage) && lineage !== parent) {
        lineage = lineage.parentFolder;
      }
      return lineage === parent;
    }

    const row = this.rows.get(index) as Folder;
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

  public setSite(mapping: HarvestMapping, siteId: number): void {
    mapping.siteId = siteId;
    this.updateHarvestWithMappingChange();
  }

  public setOffset(mapping: HarvestMapping, offset: string): void {
    mapping.utcOffset = offset;
    this.updateHarvestWithMappingChange();
  }

  public setIsRecursive(mapping: HarvestMapping, isRecursive: boolean): void {
    mapping.recursive = isRecursive;
    this.updateHarvestWithMappingChange();
  }

  public isFolder(row: Row): row is Folder {
    return row.rowType === RowType.folder;
  }

  public isFile(row: Row): row is File {
    return row.rowType === RowType.file;
  }

  public isLoadMore(row: Row): row is LoadMore {
    return row.rowType === RowType.loadMore;
  }

  public getValidationMessages(
    row: Folder | File
  ): { fixable: boolean; message: string }[] {
    return (row.harvestItem.validations ?? []).map((validation) => ({
      fixable: validation.status === "fixable",
      message: validation.message,
    }));
  }

  public toggleValidationMessages(row: File | Folder): void {
    if (this.isFile(row)) {
      row.showValidations = !row.showValidations;
    }
  }

  public hasItemsInvalidFixable(row: Row): boolean {
    return row.harvestItem.report.itemsInvalidFixable > 0;
  }

  public hasItemsInvalidNotFixable(row: Row): boolean {
    return row.harvestItem.report.itemsInvalidNotFixable > 0;
  }

  public hasItemsInvalid(row: Row): boolean {
    return (
      this.hasItemsInvalidFixable(row) || this.hasItemsInvalidNotFixable(row)
    );
  }

  private findMapping(
    harvest: Harvest,
    harvestItem: HarvestItem
  ): HarvestMapping {
    let mapping = harvest.mappings.find(
      (_mapping): boolean => harvestItem.path === _mapping.path
    );

    if (!mapping) {
      mapping = new HarvestMapping(
        {
          path: harvestItem.path,
          recursive: true,
          siteId: null,
          utcOffset: null,
        },
        this.injector
      );
      harvest.mappings.push(mapping);
    }

    return mapping;
  }

  private generateRow(
    harvestItem: HarvestItem,
    parentRow: Folder,
    page: number
  ): Row {
    const mapping = this.findMapping(this.harvest, harvestItem);
    // While it is technically possible in linux to have filenames which
    // include the character '/', our server should block it from being used
    // and bad actors will gain nothing from taking advantage of it
    const paths = harvestItem.path.split("/");
    const indentation = paths.length - 1;
    const filename = paths.pop();

    if (harvestItem.isDirectory) {
      return {
        rowType: RowType.folder,
        harvestItem,
        isOpen: false,
        mapping,
        page,
        path: filename,
        recursive: mapping.recursive,
        siteId: mapping.siteId,
        utcOffset: mapping.utcOffset,
        parentFolder: parentRow,
        indentation,
      } as Folder;
    } else {
      return {
        rowType: RowType.file,
        harvestItem,
        mapping,
        path: filename,
        parentFolder: parentRow,
        indentation,
        showValidations: false,
      } as File;
    }
  }

  private updateHarvestWithMappingChange(): void {
    this.hasUnsavedChanges = true;
    this.harvestApi
      .updateMappings(
        this.harvest,
        this.rows
          .filter((row) => row.rowType === RowType.folder)
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

  public replaceMe(length: number) {
    return Array(length)
      .fill(0)
      .map((_, i) => i);
  }
}
