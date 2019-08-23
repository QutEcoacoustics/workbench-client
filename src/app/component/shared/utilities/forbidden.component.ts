import { Component } from "@angular/core";

@Component({
  selector: "app-forbidden",
  template: `
    <h1>Forbidden</h1>
    <p>You do not have sufficient permissions to access this page.</p>
  `
})
export class ForbiddenComponent {
  constructor() {}
}
