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
  BawPalettes,
  BawPaletteType,
  BawVariantType,
  ThemeService,
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
  @ViewChildren("colorBox") private colorBoxes!: QueryList<ElementRef>;

  public currentPallette: string[] = [];
  public selected: { palette: BawPalettes; color: string } = {
    palette: BawPalettes.highlight,
    color: "#000",
  };

  public palettes: BawPaletteType[];
  public colors: {
    palette: BawPaletteType;
    variant: BawVariantType;
    color: string;
    contrast: string;
  }[] = [];
  public buttons: string[] = [];
  public texts: string[] = [];
  public spinners: string[] = [];

  public constructor(
    private theme: ThemeService,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit(): void {
    const variables = this.theme.themeVariables;

    // Create list of theme palettes
    this.palettes = Object.keys(BawPalettes) as BawPaletteType[];
    for (const palette of this.palettes) {
      this.texts.push(`text-${palette}`);
      this.spinners.push(`text-${palette}`);
      this.buttons.push(`btn-${palette}`, `btn-outline-${palette}`);

      const variants = Object.keys(variables[palette]) as BawVariantType[];
      for (const variant of variants) {
        const { color, contrast } = variables[palette][variant];

        this.colors.push({
          palette,
          variant,
          color: color.base,
          contrast: contrast.base,
        });
      }
    }
  }

  public ngAfterViewInit(): void {
    this.updateColorDescriptions();
    this.resetSelection();
    // Prevents angular from complaining about variables changing
    this.ref.detectChanges();
  }

  public onPaletteChange(e: Event): void {
    const palette = (e.target as HTMLSelectElement).value as BawPalettes;
    this.selected = { palette, color: this.getPaletteBaseColor(palette) };
  }

  public onColorChange(e: Event): void {
    const color = (e.target as HTMLInputElement).value;
    this.theme.setPalette(this.selected.palette, color);
    this.selected.color = color;
    this.updateColorDescriptions();
  }

  public resetColors(): void {
    for (const paletteKey in BawPalettes) {
      this.theme.resetPalette(BawPalettes[paletteKey]);
    }
    this.updateColorDescriptions();
    this.resetSelection();
  }

  private updateColorDescriptions(): void {
    this.colorBoxes.forEach((colorBox, index) => {
      const color = rgb(
        getComputedStyle(colorBox.nativeElement).backgroundColor
      ).hex();
      colorBox.nativeElement.querySelector("#color").innerText = color;
      this.currentPallette[index] = color;
    });
  }

  private resetSelection(): void {
    const palette = BawPalettes.highlight;
    const color = this.getPaletteBaseColor(palette);
    this.selected = { palette, color };
  }

  private getPaletteBaseColor(theme: BawPalettes): string {
    const index = this.colors.findIndex(
      (value) => value.palette === theme && value.variant === "base"
    );
    return this.currentPallette[index];
  }
}

AdminThemeTemplateComponent.linkComponentToPageInfo({
  category: adminCategory,
  menus: { actions: List(adminMenuItemActions) },
}).andMenuRoute(adminThemeMenuItem);

export { AdminThemeTemplateComponent };
