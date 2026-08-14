import { menuModal } from "@menu/widgetItem";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { defaultDeleteIcon, isLoggedInPredicate } from "src/app/app.menus";
import { MyProfileComponent } from "./pages/profile/my-profile.component";
import { myAccountMenuItem } from "./profile.menus";

export const myDeleteAccountModal = menuModal({
  icon: defaultDeleteIcon,
  label: "Cancel my account",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  component: DeleteModalComponent,
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  successCallback: (pageComponentInstance?: MyProfileComponent) => pageComponentInstance!.cancelAccount(),
  tooltip: () => "Remove your account from this website",
  disabled: "BETA: Will be available soon.",
});

