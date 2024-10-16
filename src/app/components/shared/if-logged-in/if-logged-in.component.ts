import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
} from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";

@Component({
  selector: "baw-if-logged-in",
  template: `
    @if (session.isLoggedIn) {
    <ng-content></ng-content>
    } @else {
    <span ngbTooltip="You must be logged in" aria-disabled="true">
      <ng-content></ng-content>
    </span>
    }
  `,
})
export class IfLoggedInComponent implements AfterContentInit {
  public constructor(protected session: BawSessionService) {}

  @ContentChildren(ElementRef, { descendants: true })
  private contentChildren: QueryList<ElementRef>;

  public ngAfterContentInit(): void {
    if (!this.session.isLoggedIn) {
      this.disableInteractiveContent();
    }
  }

  private disableInteractiveContent(): void {
    for (const content of this.contentChildren) {
      const nativeElement = content.nativeElement;

      // if the disabled attribute is in the elements prototype, we want to
      // set it to true
      if ("disabled" in nativeElement) {
        content.nativeElement.setAttribute("disabled", "true");
      }
    }
  }
}
