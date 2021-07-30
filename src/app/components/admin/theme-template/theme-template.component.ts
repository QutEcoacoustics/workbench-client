import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import {
  ThemeColor,
  ThemeService,
  ThemeVariant,
} from "@services/theme/theme.service";
import { rgb } from "color";
import { List } from "immutable";
import { adminCategory, adminThemeMenuItem } from "../admin.menus";
import { adminMenuItemActions } from "../dashboard/dashboard.component";

@Component({
  selector: "baw-admin-theme-template",
  templateUrl: "theme-template.component.html",
  styleUrls: ["theme-template.component.scss"],
})
class AdminThemeTemplateComponent
  extends PageComponent
  implements AfterViewInit, OnInit
{
  @ViewChildren("colorBox") private colorBoxes!: QueryList<
    ElementRef<HTMLElement>
  >;

  public currentColor: string[] = [];
  public selected: { index: number; value: string };
  public themeColors: readonly ThemeColor[];
  public themeVariants: readonly ThemeVariant[];
  public colorValues: string[];
  public darkBackground = false;

  public constructor(
    private theme: ThemeService,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit(): void {
    this.themeColors = this.theme.themeColors;
    this.themeVariants = this.theme.themeVariants;
    this.selected = { index: 0, value: this.getBoxColor(0, 0) };
  }

  public ngAfterViewInit(): void {
    this.resetSelection();
    // Prevents angular from complaining about variables changing
    this.ref.detectChanges();
  }

  public onColorChange(e: Event): void {
    const index = parseInt((e.target as HTMLSelectElement).value, 10);
    const value = this.getBoxColor(index, 0);
    this.selected = { index, value };
  }

  public onColorValueChange(e: Event): void {
    const color = (e.target as HTMLInputElement).value;
    this.theme.setColor(this.themeColors[this.selected.index], color);
    this.selected.value = color;
  }

  public getBoxColor(colorIndex: number, variantIndex: number) {
    if (!this.colorBoxes) {
      return "#000";
    }

    const boxIndex = colorIndex * this.themeVariants.length + variantIndex;
    const styles = getComputedStyle(
      this.colorBoxes.get(boxIndex).nativeElement
    );
    return rgb(styles.backgroundColor).hex();
  }

  public resetColors(): void {
    this.theme.resetTheme();
    this.resetSelection();
  }

  private resetSelection(): void {
    this.selected = { index: 0, value: this.getBoxColor(0, 0) };
  }
}

AdminThemeTemplateComponent.linkComponentToPageInfo({
  category: adminCategory,
  menus: { actions: List(adminMenuItemActions) },
}).andMenuRoute(adminThemeMenuItem);

export { AdminThemeTemplateComponent };
