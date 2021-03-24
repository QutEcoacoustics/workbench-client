import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ContactUs,
  IContactUs,
  ContactUsService,
} from "@baw-api/report/contact-us.service";
import {
  aboutCategory,
  contactUsMenuItem,
} from "@components/about/about.menus";
import {
  defaultErrorMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { RecaptchaState } from "@shared/form/form.component";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { fields } from "./contact-us.schema.json";

@Component({
  selector: "baw-about-contact-us",
  template: `
    <baw-form
      title="Contact Us"
      [model]="model"
      [fields]="fields"
      submitLabel="Submit"
      [submitLoading]="loading"
      [recaptchaSeed]="recaptchaSeed"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class ContactUsComponent extends FormTemplate<ContactUs> implements OnInit {
  public fields = fields;
  public recaptchaSeed: RecaptchaState = { state: "loading" };

  public constructor(
    private api: ContactUsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(
      notifications,
      route,
      router,
      undefined,
      () =>
        "Thank you for contacting us. " +
        "If you've asked us to contact you or we need more information, " +
        "we will be in touch with you shortly.",
      defaultErrorMsg
    );
  }

  public ngOnInit() {
    super.ngOnInit();

    this.api
      .seed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (seed) => {
          console.log("Contact Us Seed: " + seed);
          this.recaptchaSeed = { state: "loaded", seed };
        },
        (err) => {
          console.error(err);
          this.notifications.error("Failed to load form");
        }
      );
  }

  protected apiAction(model: IContactUs) {
    console.log({ model });
    return this.api.contactUs(new ContactUs(model));
  }

  protected redirectUser() {
    // Do nothing
  }
}

ContactUsComponent.linkComponentToPageInfo({
  category: aboutCategory,
}).andMenuRoute(contactUsMenuItem);

export { ContactUsComponent };
