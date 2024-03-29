import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { ImageSizes, ImageUrl } from "@interfaces/apiInterfaces";
import { assetRoot } from "@services/config/config.service";
import { API_ROOT } from "@services/config/config.tokens";
import { OrderedSet } from "immutable";

export const notFoundImage: ImageUrl = {
  url: `${assetRoot}/images/404.png`,
  size: ImageSizes.fallback,
};

@Directive({
  // Directive applies directly to all image tags instead of being
  // explicitly called
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "img",
})
export class AuthenticatedImageDirective implements OnChanges {
  /** Image src, only accessible if using [src] */
  @Input() public src: ImageUrl[] | string;
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
   * Tracks the current image
   */
  private currentImage: ImageUrl;
  /**
   * Contains url for default image
   */
  private defaultImage: ImageUrl;

  public constructor(
    @Inject(API_ROOT) private apiRoot: string,
    private session: BawSessionService,
    private imageRef: ElementRef<HTMLImageElement>
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.disableAuth || typeof this.src === "string") {
      return;
    }

    this._src = this.src;

    // On Component Initial Load
    if (changes.src.isFirstChange()) {
      this.imageEl.classList.add("square-image");
      // Prevent overriding of 'this'
      this.imageEl.onerror = () => this.errorHandler();
    }

    // Update images if src changes
    if (changes.src.currentValue !== changes.src.previousValue) {
      // Retrieve list of new images
      let newImages = OrderedSet<ImageUrl>();
      for (const image of this._src ?? []) {
        if (image.size === ImageSizes.default) {
          this.defaultImage = image;
        } else {
          newImages = newImages.add(image);
        }
      }

      // Prepend new urls (except default urls) to urls set, and sort by image size
      this.images = newImages.sort((a, b) => {
        const aPixels = a.height ?? 0 * a.width ?? 0;
        const bPixels = b.height ?? 0 * b.width ?? 0;

        if (aPixels === bPixels) {
          return 0;
        }
        return aPixels > bPixels ? -1 : 1;
      });
    }

    this.setImageSrc();
  }

  /**
   * Set src for image element
   */
  private setImageSrc(): void {
    const image = this.getNextImage();
    this.currentImage = image;
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

    // Retrieve first url from set
    const image = this.images.first(notFoundImage);
    this.images = this.images.remove(image);
    return image;
  }

  /**
   * Handle image error event
   */
  private errorHandler() {
    console.warn("Failed to load image: ", this.imageEl.src);

    // Continue searching, unless backup image404 has already been tried and failed
    if (this.currentImage !== notFoundImage) {
      this.setImageSrc();
    }
  }

  /**
   * Append authentication token to url if logged in and disableAuthentication
   * is not set.
   *
   * TODO This should be in a more general location to reduce code duplication
   *
   * @param image Image with full formed url (not a relative path) to return with auth token
   */
  private appendAuthToken(image: ImageUrl): string {
    const url = image.url;

    if (this.ignoreAuthToken || !url.startsWith(this.apiRoot)) {
      return url;
    }

    if (this.session.isLoggedIn) {
      const tokenUrl = new URL(url);
      tokenUrl.searchParams.set("authToken", this.session.authToken);
      return tokenUrl.toString();
    }
    return url;
  }

  /**
   * Returns true if all other image options are exhausted
   */
  private use404Image(): boolean {
    return this.images.count() === 0 && this.currentImage === this.defaultImage;
  }

  /**
   * Returns true if the default image is the only option left available
   */
  private useDefaultImage(): boolean {
    return (
      this.images.count() === 0 &&
      this.currentImage !== this.defaultImage &&
      !!this.defaultImage
    );
  }

  /** Get image reference native element */
  private get imageEl(): HTMLImageElement {
    return this.imageRef.nativeElement;
  }
}
