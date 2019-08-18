/**
 * A tag model.
 */
export interface TagInterface {
  id: number;
  text: string;
  isTaxanomic: boolean;
  typeOfTag:
    | "commonName"
    | "speciesName"
    | "looksLike"
    | "soundsLike"
    | "general";
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
    public readonly id: number,
    public readonly text: string,
    public readonly isTaxanomic: boolean,
    public readonly typeOfTag:
      | "commonName"
      | "speciesName"
      | "looksLike"
      | "soundsLike"
      | "general",
    public readonly retired: boolean
  ) {}
}
