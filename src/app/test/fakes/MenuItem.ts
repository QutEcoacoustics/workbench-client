import {
  Category,
  MenuAction,
  menuAction,
  MenuLink,
  menuLink,
  MenuRoute,
  menuRoute,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { MockModalComponent } from "@menu/menu/menu.component.spec";
import { menuModal, MenuModalWithoutAction } from "@menu/widgetItem";
import { modelData } from "@test/helpers/faker";

export function generateCategory(data?: Partial<Category>): Category {
  return {
    icon: modelData.icon(),
    label: modelData.random.word(),
    route: StrongRoute.newRoot().addFeatureModule(modelData.random.word()),
    ...data,
  };
}

export function generateMenuRoute(data?: Partial<MenuRoute>): MenuRoute {
  const tooltip = modelData.random.words();
  return menuRoute({
    icon: modelData.icon(),
    label: modelData.random.word(),
    route: StrongRoute.newRoot().addFeatureModule(modelData.random.word()),
    tooltip: () => tooltip,
    title: () => modelData.word.noun(),
    ...data,
  });
}

export function generateMenuLink(data?: Partial<MenuLink>): MenuLink {
  const tooltip = modelData.random.words();
  const uri = modelData.internet.url();
  return menuLink({
    icon: modelData.icon(),
    label: modelData.random.word(),
    uri: () => uri,
    tooltip: () => tooltip,
    ...data,
  });
}

export function generateMenuAction(data?: Partial<MenuAction>): MenuAction {
  const tooltip = modelData.random.words();
  return menuAction({
    icon: modelData.icon(),
    label: modelData.random.word(),
    action: () => {},
    tooltip: () => tooltip,
    ...data,
  });
}

export function generateMenuModalWithoutAction(
  data?: Partial<MenuModalWithoutAction>
): MenuModalWithoutAction {
  const tooltip = modelData.random.words();
  return menuModal({
    icon: modelData.icon(),
    label: modelData.random.word(),
    tooltip: () => tooltip,
    component: MockModalComponent,
    pageData: {},
    modalOpts: {},
    ...data,
  });
}
