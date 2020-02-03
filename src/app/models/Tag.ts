import { Id } from "../interfaces/apiInterfaces";

type TypeOfTag =
  | "commonName"
  | "speciesName"
  | "looksLike"
  | "soundsLike"
  | "general";

/**
 * A tag model.
 */
export interface TagInterface {
  id: Id;
  text: string;
  isTaxanomic: boolean;
  typeOfTag: TypeOfTag;
  retired: boolean;
}

/**
 * A tag model.
 */
export class Tag implements TagInterface {
  /**
   * Constructor
   * @param id Tag ID
   * @param text Tag details
   * @param isTaxanomic Is tag taxanomic
   * @param typeOfTag Tag type
   * @param retired Is tag retired
   */
  constructor(
    public readonly id: Id,
    public readonly text: string,
    public readonly isTaxanomic: boolean,
    public readonly typeOfTag: TypeOfTag,
    public readonly retired: boolean
  ) {}
}
