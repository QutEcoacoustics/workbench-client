import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
} from "@angular/core";
import { ASSET_ROOT } from "@helpers/app-initializer/app-initializer";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ImageSizes, ImageUrl } from "@interfaces/apiInterfaces";

@Directive({
  selector: "[bawImage]",
})
export class ImageDirective extends WithUnsubscribe()
  implements OnInit, OnChanges {
  @Input() src: ImageUrl[];
  @Input() thumbnail: ImageSizes;

  private image: HTMLImageElement;
  /**
   * Tracks which image from src array to display
   */
  private srcIndex = 0;
  /**
   * Tracks whether to display thumbnail. This will disable if
   * the thumbnail fails to load
   */
  private displayThumbnail = true;

  constructor(
    @Inject(ASSET_ROOT) private assetRoot: string,
    private imageRef: ElementRef
  ) {
    super();
  }

  ngOnChanges(): void {
    // Define image on first load
    if (!this.image) {
      this.image = this.imageRef.nativeElement;
    }

    this.loadSource();
  }

  ngOnInit(): void {
    this.image.onerror = () => {
      // tslint:disable-next-line: no-console
      console.warn("Failed to load image: ", this.image.src);

      // Only increment index if thumbnail was not displayed
      if (!this.displayThumbnail || !this.thumbnail) {
        this.srcIndex++;
      }

      this.displayThumbnail = false;
      this.loadSource();
    };
  }

  private loadSource(): void {
    let url =
      this.displayThumbnail && !!this.thumbnail
        ? this.getImageUrl(this.src, this.thumbnail)
        : this.src[this.srcIndex].url;
    url = this.formatLocalUrl(url);

    this.image.src = url;
  }

  /**
   * Prepend the asset root to any local urls
   * @param url Url to potentially format
   */
  private formatLocalUrl(url: string): string {
    if (url.startsWith("/") && !url.startsWith(this.assetRoot)) {
      return this.assetRoot + url;
    }
    return url;
  }

  /**
   * Get image from imageUrls which relates to the given size
   * @param size Size of image
   * @returns Image URL
   */
  private getImageUrl(images: ImageUrl[], size: ImageSizes): string {
    for (const imageUrl of images) {
      if (imageUrl.size === size) {
        return imageUrl.url;
      }
    }

    return this.getImageUrl(images, ImageSizes.DEFAULT);
  }
}
