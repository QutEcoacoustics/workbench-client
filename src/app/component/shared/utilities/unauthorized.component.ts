import { Component } from "@angular/core";

@Component({
  selector: "app-unauthorized",
  template: `
    <h1>Unauthorized Access</h1>
    <p>You need to log in or register before continuing.</p>
  `
})
export class UnauthorizedComponent {
  constructor() {}
}
