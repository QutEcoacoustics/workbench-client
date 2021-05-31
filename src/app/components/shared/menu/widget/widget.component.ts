import { PageInfo } from "@helpers/page/pageInfo";

/** Generic widget component */
export interface WidgetComponent {
  pageData: any;
}

/** Modal widget component */
export interface ModalComponent extends WidgetComponent {
  pageData: any;
  // We pass route data to the component because it exists outside
  // the router-outlet and thus cannot access the route data
  routeData: PageInfo;
  closeModal: (result: any) => void;
  dismissModal: (reason: any) => void;
}
