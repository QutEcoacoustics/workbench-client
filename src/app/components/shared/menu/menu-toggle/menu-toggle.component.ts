import { Component, Input, OnInit, Output } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { MenuType } from "@helpers/generalTypes";
import { MenuService } from "@services/menu/menu.service";
import { BehaviorSubject, Observable } from "rxjs";
import { NgClass } from "@angular/common";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

export type LeftOrRight = "left" | "right";

export enum MenuState {
  opened,
  closed,
}

@Component({
  selector: "baw-menu-toggle",
  template: `
    <button type="button" [ngClass]="[alignment, 'text-' + color]" (click)="toggleMenu()">
      <span class="visually-hidden">Toggle {{ menuType }} Menu</span>
      <fa-icon size="2x" [icon]="getIcon()"></fa-icon>
    </button>
  `,
  styles: [
    `
      button {
        align-content: center;
        all: unset;
        cursor: pointer;
        display: flex;
        height: 32px;
        width: 32px;
      }

      .right {
        justify-content: end;
      }
    `,
  ],
  imports: [NgClass, FaIconComponent],
})
export class MenuToggleComponent implements OnInit {
  @Input() public menuType: MenuType;
  @Input() public color: BootstrapColorTypes = "light";
  @Input() public alignment: LeftOrRight = "left";

  @Output() public get menuToggle(): Observable<MenuState> {
    return this._menuToggle;
  }

  private _menuToggle = new BehaviorSubject<MenuState>(MenuState.closed);

  public constructor(public menu: MenuService) {}

  public ngOnInit(): void {
    this._menuToggle.next(this.getMenuState());
  }

  public toggleMenu(): void {
    this.menu.toggleMenu();
    this._menuToggle.next(this.getMenuState());
  }

  public getIcon(): IconProp {
    const opened: IconProp = ["fas", "times"];
    const closed: IconProp = ["fas", "bars"];
    return this.menu.isMenuOpen ? opened : closed;
  }

  private getMenuState() {
    const showButton = this.menu.isFullscreen && this.menu.isMenuOpen;
    return showButton ? MenuState.opened : MenuState.closed;
  }
}
