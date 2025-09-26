import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { HarvestItem } from "@models/HarvestItem";
import { HarvestMapping } from "@models/Harvest";
import { List } from "immutable";

enum RowType {
  folder,
  file,
  loadMore,
}

export { RowType };

export const metaReviewIcons = {
  folderOpen: ["fas", "folder-open"],
  folderClosed: ["fas", "folder-closed"],
  successCircle: ["fas", "circle-check"],
  success: ["fas", "check"],
  warningCircle: ["fas", "circle-exclamation"],
  warning: ["fas", "triangle-exclamation"],
  failureCircle: ["fas", "xmark-circle"],
  failure: ["fas", "xmark"],
  errorCircle: ["fas", "xmark-circle"],
  error: ["fas", "xmark"],
} as const satisfies Record<string, IconProp>;

export interface MetaReviewBase {
  rowType: RowType;
  harvestItem?: HarvestItem;
  /**
   * Row Mapping, if unset, this row will not be included in the mappings sent
   * to the server
   */
  mapping?: HarvestMapping;
}

// Forward declaration for circular reference
export interface MetaReviewFolder extends MetaReviewItem {
  rowType: RowType.folder;
  isOpen: boolean;
  page: number;
  isRoot: boolean;
}

export interface MetaReviewItem extends MetaReviewBase {
  path: string;
  parentFolder?: MetaReviewFolder;
  indentation: Array<void>;
}

export interface MetaReviewFile extends MetaReviewItem {
  rowType: RowType.file;
  showValidations: boolean;
}

export interface MetaReviewLoadMore extends MetaReviewBase {
  rowType: RowType.loadMore;
  parentFolder?: MetaReviewFolder;
  page: number;
  isLoading: boolean;
}

export type MetaReviewRow =
  | MetaReviewFile
  | MetaReviewFolder
  | MetaReviewLoadMore;

export type Rows = List<MetaReviewRow>;
