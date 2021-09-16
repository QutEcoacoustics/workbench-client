import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { SecurityService } from "@baw-api/security/security.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { ImageSizes, ImageUrl } from "@interfaces/apiInterfaces";
import { assetRoot } from "@services/config/config.service";
import { OrderedSet } from "immutable";

export const notFoundImage: ImageUrl = {
  url: `${assetRoot}/images/404.png`,
  height: 221,
  width: 220,
  size: ImageSizes.fallback,
};
export const image404RelativeSrc = `${assetRoot}/images/404.png`;

@Directive({
  // Directive applies directly to all image tags instead of being
  // explicitly called
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "img",
})
export class AuthenticatedImageDirective implements OnChanges {
  /** Image src, only accessible if using [src] */
  @Input() public src: ImageUrl[] | string;
  /** Image thumbnail size to display if exists */
  @Input() public thumbnail: ImageSizes;
  /** Do not append auth token to image url */
  @Input() public ignoreAuthToken: boolean;
  /** Disable authenticated image directive on image */
  @Input() public disableAuth: boolean;

  private _src: ImageUrl[];
  /**
   * Tracks potential url options to be used for src
   */
  private images = OrderedSet<ImageUrl>();
  /**
   * Tracks used url options
   */
  private usedImages = OrderedSet<ImageUrl>();
  /**
   * Tracks whether to display src matching thumbnail size
   */
  private displayThumbnail = false;
  /**
   * Contains url for default image
   */
  private defaultImage: ImageUrl;

  public constructor(
    @Inject(API_ROOT) private apiRoot: string,
    private securityApi: SecurityService,
    private imageRef: ElementRef<HTMLImageElement>
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.disableAuth || typeof this.src === "string") {
      return;
    }

    this._src = this.src;

    // On Component Initial Load
    if (changes.src.isFirstChange()) {
      this.imageEl.classList.add("loading-image");

      this.imageEl.onerror = () => {
        // Prevent overriding of 'this'
        this.errorHandler();
      };

      this.imageEl.onload = () => {
        // Prevent overriding of 'this'
        this.imageEl.classList.remove("loading-image");
        this.imageEl.classList.add("loaded-image");
      };
    }

    // Re-enable use of current src
    if (this.usedImages.count() > 0) {
      this.usedImages = this.usedImages.delete(this.usedImages.last());
    }

    // Retrieve list of new images
    let newImages = OrderedSet<ImageUrl>();
    for (const image of this._src ?? []) {
      if (image.size === ImageSizes.default) {
        this.defaultImage = image;
      } else {
        newImages = newImages.add(image);
      }
    }

    // Prepend new urls (except default urls) to urls set
    this.images = newImages.concat(this.images);
    this.displayThumbnail = !!this.thumbnail;
    this.setImageSrc();
  }

  /**
   * Set src for image element
   */
  private setImageSrc(): void {
    const image = this.getNextImage();
    this.usedImages = this.usedImages.add(image);
    this.imageEl.src = this.appendAuthToken(image);
  }

  /**
   * Get next image to use
   */
  private getNextImage(): ImageUrl {
    if (this.useDefaultImage()) {
      return this.defaultImage;
    }

    if (this.use404Image()) {
      return notFoundImage;
    }

    // Find thumbnail if exists
    if (this.displayThumbnail) {
      const image = this._src.find((meta) => meta.size === this.thumbnail);
      if (image) {
        return image;
      }
    }

    // Retrieve first url from set
    const firstUrl = this.images.subtract(this.usedImages).first();
    if (firstUrl) {
      return firstUrl;
    }

    // Final fallback
    return notFoundImage;
  }

  /**
   * Handle image error event
   */
  private errorHandler() {
    console.warn("Failed to load image: ", this.imageEl.src);

    // No longer attempt to use thumbnail
    if (this.displayThumbnail) {
      this.displayThumbnail = false;
    }

    // Continue searching, unless backup image404 has already been tried and failed
    if (!this.usedImages.contains(notFoundImage)) {
      this.setImageSrc();
    }
  }

  /**
   * Append authentication token to url if logged in and disableAuthentication
   * is not set.
   *
   * @param image Image with full formed url (not a relative path) to return with auth token
   */
  private appendAuthToken(image: ImageUrl): string {
    const url = image.url;

    if (this.ignoreAuthToken || !url.startsWith(this.apiRoot)) {
      return url;
    }

    const user = this.securityApi.getLocalUser();
    if (user?.authToken) {
      const tokenUrl = new URL(url);
      tokenUrl.searchParams.set("authToken", user.authToken);
      return tokenUrl.toString();
    }
    return url;
  }

  /**
   * Returns true if all other image options are exhausted
   */
  private use404Image(): boolean {
    const hasDefaultImageAvailable = this.defaultImage
      ? // Checks if defaultImage has been used
        this.images.count() + 1 === this.usedImages.count()
      : this.images.count() === this.usedImages.count();

    return !this._src || hasDefaultImageAvailable;
  }

  /**
   * Returns true if the default image is the only option left available
   */
  private useDefaultImage(): boolean {
    return this.defaultImage && this.images.count() === this.usedImages.count();
  }

  /** Get image reference native element */
  private get imageEl(): HTMLImageElement {
    return this.imageRef.nativeElement;
  }
}
