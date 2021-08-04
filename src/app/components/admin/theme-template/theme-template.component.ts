import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
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
import { List } from "immutable";
import { rgb } from "d3-color";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { adminCategory, adminThemeMenuItem } from "../admin.menus";
import { adminMenuItemActions } from "../dashboard/dashboard.component";

@Component({
  selector: "baw-admin-theme-template",
  templateUrl: "theme-template.component.html",
  styleUrls: ["theme-template.component.scss"],
})
class AdminThemeTemplateComponent
  extends PageComponent
  implements OnInit, AfterViewInit
{
  @ViewChildren("colorBox") private colorBoxes!: QueryList<
    ElementRef<HTMLElement>
  >;

  public selectedColorIndex: number;
  public themeColors: readonly ThemeColor[];
  public themeVariants: readonly ThemeVariant[];

  public constructor(
    @Inject(IS_SERVER_PLATFORM) public isServer: boolean,
    private theme: ThemeService,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit(): void {
    this.themeColors = this.theme.themeColors;
    this.themeVariants = this.theme.themeVariants;
    this.resetSelection();
  }

  public ngAfterViewInit(): void {
    // Output of getBoxColor changes afterViewInit. This ref update causes
    // angular to properly detect the change
    this.ref.detectChanges();
  }

  public onColorChange(e: Event): void {
    const inputColorIndex = (e.target as HTMLSelectElement).value;
    this.selectedColorIndex = parseInt(inputColorIndex, 10);
  }

  public onColorValueChange(e: Event): void {
    const color = this.themeColors[this.selectedColorIndex];
    const value = (e.target as HTMLInputElement).value;
    this.theme.setColor(color, value);
  }

  public getBoxColor(colorIndex: number, variantIndex: number = 0) {
    if (!this.colorBoxes || this.isServer) {
      return "#000";
    }

    const boxIndex = colorIndex * this.themeVariants.length + variantIndex;
    const styles = getComputedStyle(
      this.colorBoxes.get(boxIndex).nativeElement
    );
    return rgb(styles.backgroundColor).formatHex();
  }

  public resetColors(): void {
    this.theme.resetTheme();
    this.resetSelection();
  }

  private resetSelection(): void {
    this.selectedColorIndex = 0;
  }
}

AdminThemeTemplateComponent.linkComponentToPageInfo({
  category: adminCategory,
  menus: { actions: List(adminMenuItemActions) },
}).andMenuRoute(adminThemeMenuItem);

export { AdminThemeTemplateComponent };
