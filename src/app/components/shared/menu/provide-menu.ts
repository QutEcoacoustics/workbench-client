import { EnvironmentProviders, Provider } from "@angular/core";
import { DefaultMenu, DEFAULT_MENU } from "@helpers/page/defaultMenus";
import { ConfigService } from "@services/config/config.service";

export const menuProviders: (EnvironmentProviders | Provider)[] = [
  {
    provide: DEFAULT_MENU,
    useFactory: DefaultMenu.getMenu,
    deps: [ConfigService],
  },
];
