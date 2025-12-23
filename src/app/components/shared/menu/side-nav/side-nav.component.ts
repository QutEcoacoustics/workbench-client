import { Component, inject } from "@angular/core";
import { MenuService } from "@services/menu/menu.service";

@Component({
  selector: "baw-side-nav",
  template: `
    <div class="menu-container text-bg-light" [class.show]="menu.isMenuOpen">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: "./side-nav.component.scss",
})
export class SideNavComponent {
  protected readonly menu = inject(MenuService);
}
