import { Injector } from "@angular/core";
import { DateTimeTimezone } from "@interfaces/apiInterfaces";
import { AbstractModelWithoutId } from "@models/AbstractModel";
import { bawDuration, bawDateTime } from "@models/AttributeDecorators";
import { Duration } from "luxon";

export interface IHarvestReport {
  itemsTotal?: number;
  itemsSizeBytes?: number;
  itemsDurationSeconds?: number;
  itemsInvalidFixable?: number;
  itemsInvalidNotFixable?: number;
  itemsNew?: number;
  itemsMetadataGathered?: number;
  itemsFailed?: number;
  itemsCompleted?: number;
  itemsErrored?: number;
  latestActivity?: DateTimeTimezone | string;
  runTimeSeconds?: number;
}

export class HarvestReport
  extends AbstractModelWithoutId
  implements IHarvestReport
{
  public readonly kind = "HarvestReport";
  public readonly itemsTotal?: number;
  public readonly itemsSizeBytes?: number;
  public readonly itemsDurationSeconds?: number;
  @bawDuration<HarvestReport>({ key: "itemsDurationSeconds" })
  public readonly itemsDuration?: Duration;
  public readonly itemsInvalidFixable?: number;
  public readonly itemsInvalidNotFixable?: number;
  public readonly itemsNew?: number;
  public readonly itemsMetadataGathered?: number;
  public readonly itemsFailed?: number;
  public readonly itemsCompleted?: number;
  public readonly itemsErrored?: number;
  @bawDateTime()
  public readonly latestActivity?: DateTimeTimezone;
  public readonly runTimeSeconds?: number;

  public constructor(data: IHarvestReport, injector?: Injector) {
    super(data, injector);
  }

  public get viewUrl(): string {
    throw new Error("HarvestReport does not have a viewUrl");
  }
}
