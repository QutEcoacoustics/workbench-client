import { Pipe, PipeTransform } from "@angular/core";
import { AbstractModel, UnresolvedModel } from "@models/AbstractModel";

@Pipe({
  name: "timezone",
})
export class TimezonePipe implements PipeTransform {
  public transform(
    model: AbstractModel & { tzinfoTz?: string },
    options: { loading?: string; noTimezone?: string } = {}
  ): string {
    return model === UnresolvedModel.one
      ? options.loading ?? "loading"
      : model.tzinfoTz ?? options.noTimezone ?? "Unknown timezone";
  }
}
