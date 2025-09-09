import { ElementRef, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ScrollService {
  public scrollToElement(
    elementRef: ElementRef | HTMLElement,
    options?: ScrollIntoViewOptions,
  ): void {
    const element =
      elementRef instanceof ElementRef ? elementRef.nativeElement : elementRef;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      ...options,
    });
  }
}
