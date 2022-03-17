import { IPageInfo } from "@helpers/page/pageInfo";

/** Generic widget component */
export interface WidgetComponent {
  pageData: IPageInfo;
}

/** Modal widget component */
export interface ModalComponent extends WidgetComponent {
  pageData: IPageInfo;
  closeModal: (result: any) => void;
  dismissModal: (reason: any) => void;
}
