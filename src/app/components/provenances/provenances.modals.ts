import { menuModal } from "@menu/widgetItem";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { defaultDeleteIcon, isAdminPredicate } from "src/app/app.menus";
import { provenanceMenuItem } from "./provenances.menus";
import { ProvenanceDetailsComponent } from "./pages/details/details.component";

export const deleteProvenanceModal = menuModal({
  icon: defaultDeleteIcon,
  label: "Delete provenance",
  parent: provenanceMenuItem,
  tooltip: () => "Delete this provenance",
  predicate: isAdminPredicate,
  component: DeleteModalComponent,
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  successCallback: (pageComponentInstance?: ProvenanceDetailsComponent) =>
    pageComponentInstance!.deleteModel(),
});
