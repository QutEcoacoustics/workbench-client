import { Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";

/**
 * Timezone Input
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-timezone-input",
  template: ` <p>Timezone Input Placeholder</p> `,
})
// template: `
//   <div class="form-group">
//     <label *ngIf="field.templateOptions.label" [for]="field.id">
//       {{
//         field.templateOptions.label +
//           (field.templateOptions.required ? " *" : "")
//       }}
//     </label>

//     <div class="input-group">
//       <select
//         class="w-100 form-control"
//         [id]="field.id"
//         [formControl]="formControl"
//         [formlyAttributes]="field"
//         (change)="calculateCurrentTime()"
//       >
//         <option value=""></option>
//         <ng-container *ngFor="let timezone of timezones">
//           <ng-container *ngIf="timezone.zones.length === 1; else group">
//             <!-- Create singular option -->
//             <option [value]="timezone.zones[0]">
//               {{ timezone.iso | iso2CountryPipe }}
//             </option>
//           </ng-container>
//           <ng-template #group>
//             <!-- Create subgroup of countries with same timezone -->
//             <optgroup [label]="timezone.iso | iso2CountryPipe">
//               <option *ngFor="let zone of timezone.zones" [value]="zone">
//                 {{ timezone.iso | iso2CountryPipe }} -
//                 {{ formatTimezoneString(zone) }}
//               </option>
//             </optgroup>
//           </ng-template>
//         </ng-container>
//       </select>
//       <div class="input-group-append">
//         <div class="input-group-text">
//           <small>{{
//             model[key] ? offsetOfTimezone(model[key]) : "(no match)"
//           }}</small>
//         </div>
//       </div>
//     </div>
//     <small class="form-text text-muted">{{ currentTime }}</small>
//   </div>
// `
// })
// tslint:disable-next-line: component-class-suffix
export class FormlyTimezoneInput extends FieldType implements OnInit {
  constructor() {
    super();
  }

  public ngOnInit() {}
}
