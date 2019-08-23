import { Component } from "@angular/core";

@Component({
  selector: "app-item-not-found",
  template: `
    <h1>Not found</h1>
    <p>Could not find the requested item.</p>
  `
})
export class ItemNotFoundComponent {
  constructor() {}
}
