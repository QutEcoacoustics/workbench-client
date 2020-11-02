import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { BootstrapScreenSizes } from "@helpers/bootstrapTypes";

/**
 * Display a spinner if the supplied value is undefined
 */
@Pipe({
  name: "spinner",
})
export class SpinnerPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  public transform<T>(
    value: T,
    size: BootstrapScreenSizes = "sm"
  ): T | SafeHtml {
    const spinner = this.sanitizer.bypassSecurityTrustHtml(`
    <div class="spinner-border spinner-border-${size} text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `);

    return value ?? spinner;
  }
}
