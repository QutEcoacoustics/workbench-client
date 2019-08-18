/**
 * A user model.
 */
export interface UserInterface {
  authToken: string;
  username: string;
  id: number;
  role: "Admin" | "User";
}

/**
 * A user model.
 */
export class User implements UserInterface {
  /**
   * Constructor
   * @param id User ID
   * @param username Username
   * @param role User role
   * @param authToken Authentication token
   */
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly role: "Admin" | "User",
    public authToken: string
  ) {}
}
