import { NgModule } from "@angular/core";
import { DefaultMenu, DEFAULT_MENU } from "@helpers/page/defaultMenus";
import { ConfigService } from "@services/config/config.service";

/**
 * Menus Module
 */
@NgModule({
  providers: [
    {
      provide: DEFAULT_MENU,
      useFactory: DefaultMenu.getMenu,
      deps: [ConfigService],
    },
  ],
})
export class MenuModule {}
