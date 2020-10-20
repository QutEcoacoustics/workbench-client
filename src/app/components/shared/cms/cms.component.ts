import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { CMS, CmsService } from "@baw-api/cms/cms.service";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";

/**
 * CMS Wrapper
 */
@Component({
  selector: "baw-cms",
  template: `
    <baw-loading *ngIf="loading" title="Loading"></baw-loading>
    <baw-error-handler *ngIf="error" [error]="error"></baw-error-handler>
  `,
})
export class CmsComponent extends WithUnsubscribe() implements OnInit {
  @Input() public page: CMS;
  public error: ApiErrorDetails;
  public loading: boolean;

  constructor(
    private cms: CmsService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit() {
    this.loading = true;

    this.cms.get(this.page).subscribe(
      (blob) => {
        // Using html fragments instead of angular sanitization sanitization
        // uses innerHTML to insert html blobs, and this will not run <script>
        // tags. This is a safety feature of innerHTML and cannot be bypassed.
        const range = document.createRange();
        const fragment = range.createContextualFragment(blob);
        this.renderer.appendChild(this.elRef.nativeElement, fragment);
        this.loading = false;
        this.ref.detectChanges();
      },
      (err: ApiErrorDetails) => {
        this.error = err;
        this.loading = false;
        this.ref.detectChanges();
      }
    );
  }
}
