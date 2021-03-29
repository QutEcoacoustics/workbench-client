import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ContactUs,
  ContactUsService,
  IContactUs,
} from "@baw-api/report/contact-us.service";
import {
  aboutCategory,
  contactUsMenuItem,
} from "@components/about/about.menus";
import { dataRequestMenuItem } from "@components/data-request/data-request.menus";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import {
  defaultErrorMsg,
  SimpleFormTemplate,
} from "@helpers/formTemplate/simpleFormTemplate";
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
    >
      <span id="subTitle">
        This form is for general enquiries. We have separate forms to
        <a [strongRoute]="dataRequestRoute">request data</a> or
        <a [strongRoute]="reportProblemRoute">report issues</a>.
      </span>
    </baw-form>
  `,
})
class ContactUsComponent
  extends SimpleFormTemplate<ContactUs>
  implements OnInit {
  public fields = fields;
  public recaptchaSeed: RecaptchaState = { state: "loading" };
  public dataRequestRoute = dataRequestMenuItem.route;
  public reportProblemRoute = reportProblemMenuItem.route;

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
        ({ seed, action }) =>
          (this.recaptchaSeed = { state: "loaded", action, seed }),
        (err) => {
          console.error(err);
          this.notifications.error("Failed to load form");
        }
      );
  }

  protected apiAction(model: IContactUs) {
    return this.api.contactUs(new ContactUs(model));
  }
}

ContactUsComponent.linkComponentToPageInfo({
  category: aboutCategory,
}).andMenuRoute(contactUsMenuItem);

export { ContactUsComponent };
