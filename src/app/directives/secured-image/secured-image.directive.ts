import { HttpClient } from "@angular/common/http";
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AppConfigService } from "@services/app-config/app-config.service";
import { BehaviorSubject, Observable } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";

@Directive({
  selector: "[bawImage]",
})
export class SecuredImageDirective extends WithUnsubscribe()
  implements OnInit, OnChanges, OnDestroy {
  @Input() private src: string | SafeUrl;
  private src$ = new BehaviorSubject<string>(this.src as string);
  private sanitizedUrl: string;

  constructor(
    private imageRef: ElementRef,
    private config: AppConfigService,
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit(): void {
    this.src$
      .pipe(
        switchMap((url) => this.loadImage(url)),
        takeUntil(this.unsubscribe)
      )
      .subscribe();
  }

  ngOnChanges(): void {
    if (typeof this.src === "string") {
      this.src$.next(this.src);
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    // Need to release object url
    URL.revokeObjectURL(this.sanitizedUrl);
  }

  private loadImage(url: string): Observable<void> {
    // Append assets root if url is using relative pathing
    if (url.startsWith("/")) {
      url = this.config.environment.assetRoot + url;
    }

    return this.http.get(url, { responseType: "blob" }).pipe(
      map((e) => {
        this.sanitizedUrl = URL.createObjectURL(e);
        this.imageRef.nativeElement.src = this.sanitizedUrl;
      })
    );
  }
}
