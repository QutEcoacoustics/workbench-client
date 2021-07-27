import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import {
  bawThemes,
  BawTheme,
  ThemeService,
  bawThemeVariants,
} from "@services/theme/theme.service";
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
  implements AfterViewInit
{
  @ViewChildren("themeBox") private themeBoxes!: QueryList<ElementRef>;

  public currentPallette: string[] = [];
  public themes = bawThemes;
  public variants = bawThemeVariants;
  public selected: { theme: BawTheme; color: string } = {
    theme: "highlight",
    color: "#000",
  };

  public constructor(
    private theme: ThemeService,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  public onThemeChange(e: Event) {
    const theme: BawTheme = (e.target as HTMLSelectElement).value as BawTheme;
    this.selected = { theme, color: this.getThemeColor(theme) };
    console.log("theme change", e, theme);
  }

  public onColorChange(e: Event) {
    const color = (e.target as HTMLInputElement).value;
    this.theme.setTheme(this.selected.theme, color);
    this.selected.color = color;
    this.updateColorDescriptions();
  }

  public ngAfterViewInit(): void {
    this.updateColorDescriptions();
    this.selected = {
      theme: "highlight",
      color: this.getThemeColor("highlight"),
    };
    // Prevents angular from complaining about variables changing
    this.ref.detectChanges();
  }

  public updateColorDescriptions(): void {
    const zeroPad = (num: string, places: number): string =>
      String(num).padStart(places, "0");
    const convertToHexadecimal = (value: string): string =>
      zeroPad(parseInt(value, 10).toString(16), 2);
    const convertToRgbHex = (color: string): string =>
      "#" +
      color
        .substring(4, color.length - 1)
        .split(",")
        .map((value) => convertToHexadecimal(value))
        .join("");

    this.themeBoxes.forEach((themeBox, index) => {
      let color = getComputedStyle(themeBox.nativeElement).backgroundColor;
      color = convertToRgbHex(color);
      themeBox.nativeElement.querySelector("#color").innerText = color;
      this.currentPallette[index] = color;
    });
  }

  public resetColors(): void {
    this.themes.forEach((theme) => this.theme.resetTheme(theme));
    this.updateColorDescriptions();
    this.selected = {
      theme: "highlight",
      color: this.getThemeColor("highlight"),
    };
  }

  private getThemeColor(theme: BawTheme): string {
    let index = this.themes.findIndex((value) => value === theme);
    index *= this.variants.length;
    return this.currentPallette[index];
  }
}

AdminThemeTemplateComponent.linkComponentToPageInfo({
  category: adminCategory,
  menus: { actions: List(adminMenuItemActions) },
}).andMenuRoute(adminThemeMenuItem);

export { AdminThemeTemplateComponent };
