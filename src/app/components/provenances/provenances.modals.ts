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
  // @ts-expect-error: strict mode fix
  successCallback: (pageComponentInstance?: ProvenanceDetailsComponent) =>
    pageComponentInstance!.deleteModel(),
});
