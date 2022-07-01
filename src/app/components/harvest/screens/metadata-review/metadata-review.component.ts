import { Component, Injector, OnInit } from "@angular/core";
import { HarvestItemsService } from "@baw-api/harvest/harvest-items.service";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { Statistic } from "@components/harvest/components/shared/statistics.component";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { newSiteMenuItem } from "@components/sites/sites.menus";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
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

// TODO Show additional information to users if itemsError is non zero. Ie:
// An unexpected error occurred in xxx files. Please contact us so we can investigate the issue.
// You can choose to continue the harvest, but any files that produced errors will be ignored

enum RowType {
  item,
  loading,
  more,
}

enum FileType {
  closedFolder,
  openedFolder,
  file,
}

interface Row {
  fileType: FileType;
  path: string;
  siteId: Id;
  utcOffset: string;
  recursive: boolean;
  harvestItem: HarvestItem;
  mapping: HarvestMapping;
  parentItem?: HarvestItem;
  page: number;
}

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
  public FileType = FileType;

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
            (harvestItem): Row => this.generateRow(harvestItem, null, 0)
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
          icon: ["fas", "triangle-exclamation"],
          label: "Need Attention",
          value: report.itemsInvalidFixable.toLocaleString(),
        },
        {
          color: "light",
          bgColor: "danger",
          icon: ["fas", "xmark"],
          label: "Problems",
          value: report.itemsInvalidNotFixable.toLocaleString(),
        },
      ],
    ];
  }

  public getHarvestItem(index: number): HarvestItem {
    return this.harvestItems[index];
  }

  public openFolder(index: number): void {
    const row = this.rows.get(index);
    row.fileType = FileType.openedFolder;
    console.log("openFolder", index, row);
    this.harvestItemsApi
      .list(this.project, this.harvest, row.harvestItem)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((harvestItems) => {
        this.rows = this.rows.splice(
          index + 1,
          0,
          ...harvestItems.map((harvestItem) =>
            this.generateRow(harvestItem, row.harvestItem, row.page + 1)
          )
        );
      });
  }

  public closeFolder(index: number): void {
    const row = this.rows.get(index);
    row.fileType = FileType.closedFolder;

    let offset = 0;
    let currRow = this.rows.get(index + 1 + offset);
    while (currRow?.parentItem === row.harvestItem) {
      offset++;
      currRow = this.rows.get(index + 1 + offset);
    }

    this.rows = this.rows.splice(index + 1, index + offset);
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
    parent: HarvestItem,
    page: number
  ): Row {
    const mapping = this.findMapping(this.harvest, harvestItem);
    return {
      fileType: harvestItem.isDirectory ? FileType.closedFolder : FileType.file,
      path: harvestItem.path,
      siteId: mapping.siteId,
      utcOffset: mapping.utcOffset,
      recursive: mapping.recursive,
      page,
      harvestItem,
      mapping,
      parentItem: parent,
    };
  }

  private updateHarvestWithMappingChange(): void {
    this.hasUnsavedChanges = true;
    this.harvestApi
      .updateMappings(
        this.harvest,
        this.rows.map((row) => row.mapping).toArray()
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
