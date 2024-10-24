import { AfterContentInit, Component, ElementRef } from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";

@Component({
  selector: "baw-if-logged-in",
  template: `
    <span [ngbTooltip]="session.isLoggedIn ? null : 'You must be logged in'">
      <ng-content></ng-content>
    </span>
  `,
})
export class IfLoggedInComponent implements AfterContentInit {
  public constructor(
    public session: BawSessionService,
    public elementRef: ElementRef
  ) {}

  public ngAfterContentInit(): void {
    this.session.authTrigger
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe(() => {
        if (!this.session.isLoggedIn) {
          this.disableInteractiveContent();
        }
      });
  }

  private disableInteractiveContent(): void {
    // TODO: use a ContentChild decorator here
    const content =
      this.elementRef.nativeElement.querySelectorAll("button, input");

    for (const element of content) {
      // if the disabled attribute is in the elements prototype, we want to
      // set it to true
      if ("disabled" in element) {
        element.setAttribute("disabled", "true");
      }
    }
  }
}
