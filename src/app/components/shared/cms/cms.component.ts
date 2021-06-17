import { DOCUMENT } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
} from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { CMS, CmsService } from "@baw-api/cms/cms.service";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { takeUntil } from "rxjs/operators";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

/**
 * CMS Wrapper
 */
@Component({
  selector: "baw-cms",
  template: `
    <ng-container *ngIf="loading">
      <h4 class="text-center">Loading</h4>
      <baw-loading></baw-loading>
    </ng-container>
    <baw-error-handler *ngIf="error" [error]="error"></baw-error-handler>
  `,
})
export class CmsComponent extends withUnsubscribe() implements OnInit {
  @Input() public page: CMS;
  public error: ApiErrorDetails;
  public loading: boolean;

  public constructor(
    private cms: CmsService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(IS_SERVER_PLATFORM) private isServer: boolean,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit() {
    this.loading = true;

    // Don't attempt to load CMS data if currently we are in SSR
    if (this.isServer) {
      return;
    }

    this.cms
      .get(this.page)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (blob) => {
          // Using html fragments instead of innerHTML.
          // In the HTML5 spec, script tags that are inserted via InnerHTML will not be executed.
          // Using a document fragment allows us to insert any tag.
          // NOTE: Angulars Sanitization is ignored since we are bypassing Angulars normal rendering system.
          // NOTE: It might be useful to consider using ShadowDom to isolate these CMS HTML fragments from
          //       the rest of the site. This would prevent, for example, a careless CSS global style in the CMS fragment
          //       from affecting the rest of the angular site.
          const range = this.document.createRange();
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
