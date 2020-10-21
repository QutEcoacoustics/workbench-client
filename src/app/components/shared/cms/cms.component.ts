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
        // Using html fragments instead of innerHTML.
        // In the HTML5 spec, script tags that are inserted via InnerHTML will not be executed.
        // Using a document fragment allows us to insert any tag.
        // NOTE: Angulars Sanitization is ignored since we are bypassing Angulars normal rendering system.
        // NOTE: It might be useful to consider using ShadowDom to isolate these CMS HTML fragments from
        //       the rest of the site. This would prevent, for example, a careless CSS global style in the CMS fragment
        //       from affecting the rest of the angular site.
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
