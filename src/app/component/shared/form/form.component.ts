import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
  @Input() schema: string;
  @Input() title?: string;
  @Input() submitLabel: string;
  @Input() error?: string;
  @Output() submit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  fields: FormlyFieldConfig[];
  model: {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.form = new FormGroup({});
    this.getJSON().subscribe(data => {
      // Convert any validator functions to Function datatype
      data.fields.forEach(field => {
        const validator = field.validators;

        if (
          validator &&
          validator.fieldMatch &&
          validator.fieldMatch.expression
        ) {
          validator.fieldMatch.expression = new Function(
            "control",
            validator.fieldMatch.expression
          );
        }
      });

      this.model = data.model;
      this.fields = data.fields;
    });
  }

  /**
   * Retrieve the form template in JSON
   * @returns Observable JSON containing form details
   */
  getJSON(): Observable<any> {
    return this.http.get(this.schema);
  }

  /**
   * Clear form error
   */
  clearError() {
    this.error = null;
  }

  /**
   * Check form submission is valid, and if so emit output event
   * @param model Form response
   */
  onSubmit(model: any) {
    console.debug("Status: " + this.form.status);
    if (this.form.status === "VALID") {
      console.debug("Emitting model");
      this.submit.emit(model);
    }
  }
}
