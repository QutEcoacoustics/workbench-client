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
  authToken: string;
  username: string;
  id: number;
  role: "Admin" | "User";

  constructor() {

  }
}
