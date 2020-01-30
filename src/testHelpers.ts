import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

export function getText(target: DebugElement, selector: string) {
  return target
    .queryAll(By.css("app-menu-internal-link span"))
    .map(x => x.nativeElement.textContent.trim());
}
