import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
  DOCUMENT
} from "@angular/core";
import { CMS, CmsService } from "@baw-api/cms/cms.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { takeUntil } from "rxjs/operators";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { LoadingComponent } from "../loading/loading.component";
import { ErrorHandlerComponent } from "../error-handler/error-handler.component";

/**
 * CMS Wrapper
 */
@Component({
  selector: "baw-cms",
  template: `
    @if (loading) {
      <h4 class="text-center">Loading</h4>
      <baw-loading></baw-loading>
    }

    @if (error) {
      <baw-error-handler [error]="error"></baw-error-handler>
    }
  `,
  imports: [LoadingComponent, ErrorHandlerComponent]
})
export class CmsComponent extends withUnsubscribe() implements OnInit {
  private readonly cms = inject(CmsService);
  private readonly renderer = inject(Renderer2);
  private readonly elRef = inject(ElementRef);
  private readonly document = inject<Document>(DOCUMENT);
  private readonly isServer = inject(IS_SERVER_PLATFORM);
  private readonly ref = inject(ChangeDetectorRef);

  @Input() public page: CMS;
  public error: BawApiError;
  public loading: boolean;

  public ngOnInit() {
    this.loading = true;

    // Don't attempt to load CMS data if currently we are in SSR
    if (this.isServer) {
      return;
    }

    this.cms
      .get(this.page)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (blob) => {
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
        error: (err: BawApiError) => {
          this.error = err;
          this.loading = false;
          this.ref.detectChanges();
        },
      });
  }
}
