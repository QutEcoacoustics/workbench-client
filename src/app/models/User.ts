/**
 * A user model.
 */
export interface UserInterface {
  authToken: string;
  username: string;
  iconUrl: string;
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
   * @param iconUrl User icon url
   * @param role User role
   * @param authToken Authentication token
   */
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly iconUrl: string,
    public readonly role: "Admin" | "User",
    public authToken: string
  ) {}
}
