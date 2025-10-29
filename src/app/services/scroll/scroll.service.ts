import { ElementRef, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ScrollService {
  public scrollToElement(
    elementRef: ElementRef | HTMLElement,
    options?: ScrollIntoViewOptions,
  ): void {
    const element =
      elementRef instanceof ElementRef ? elementRef.nativeElement : elementRef;

    // scrollIntoView causes a reflow.
    // Therefore, we wrap it in a requestAnimationFrame to allow the browser to
    // batch the reflow with other DOM changes.
    requestAnimationFrame(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        ...options,
      });
    });
  }
}
