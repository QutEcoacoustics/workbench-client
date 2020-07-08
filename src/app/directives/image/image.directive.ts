import { Directive, ElementRef, Inject, Input, OnChanges } from "@angular/core";
import { ASSET_ROOT } from "@helpers/app-initializer/app-initializer";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ImageSizes, ImageUrl } from "@interfaces/apiInterfaces";

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: "img",
})
export class ImageDirective extends WithUnsubscribe() implements OnChanges {
  @Input() src: ImageUrl[];
  @Input() thumbnail: ImageSizes;
  @Input() disableAuthentication: boolean;

  private image: HTMLImageElement;
  /**
   * Tracks which src value to display, unless thumbnail is used
   */
  private srcIndex = 0;
  /**
   * Tracks whether to display src matching thumbnail size
   */
  private displayThumbnail = false;

  constructor(
    @Inject(ASSET_ROOT) private assetRoot: string,
    private imageRef: ElementRef
  ) {
    super();
  }

  ngOnChanges(): void {
    // On Component Initial Load
    if (!this.image) {
      this.image = this.imageRef.nativeElement;
      this.image.onerror = this.errorHandler;
    }

    this.displayThumbnail = !!this.thumbnail;
    this.setImageSrc();
  }

  /**
   * Set src for image element
   */
  private setImageSrc(): void {
    let url: string;

    if (this.displayThumbnail) {
      url = this.retrieveThumbnail();
    }

    if (!url) {
      url = this.src[this.srcIndex].url;
    }

    url = this.formatIfLocalUrl(url);
    this.image.src = url;
  }

  /**
   * Handle image error event
   */
  private errorHandler() {
    // tslint:disable-next-line: no-console
    console.warn("Failed to load image: ", this.image.src);

    // Only increment index if thumbnail was not displayed
    if (!this.displayThumbnail) {
      this.srcIndex++;
    } else {
      this.displayThumbnail = false;
    }

    this.setImageSrc();
  }

  /**
   * Retrieve thumbnail image url or return null
   */
  private retrieveThumbnail(): string | null {
    for (const image of this.src) {
      if (image.size === this.thumbnail) {
        return image.url;
      }
    }
    return null;
  }

  /**
   * Prepend the asset root to any local urls
   * @param url Url to potentially format
   */
  private formatIfLocalUrl(url: string): string {
    if (url.startsWith("/") && !url.startsWith(this.assetRoot)) {
      return this.assetRoot + url;
    }
    return url;
  }
}
