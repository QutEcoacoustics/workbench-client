import { AllUploadsComponent } from "./all-uploads/all-uploads.component";
import { analysisJobPageComponents } from "./analysis-jobs/analysis-jobs.pages";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { DateTimeExampleComponent } from "./datetime-example/datetime-example.component";
import { orphanSitePageComponents } from "./orphan/orphans.pages";
import { settingsPageComponents } from "./settings/settings.pages";
import { tagGroupPageComponents } from "./tag-group/tag-groups.pages";
import { tagPageComponents } from "./tags/tags.pages";
import { AdminThemeTemplateComponent } from "./theme-template/theme-template.component";
import { AdminUserListComponent } from "./users/user.component";

export const adminPageComponents = [
  AdminDashboardComponent,
  AdminUserListComponent,
  AdminThemeTemplateComponent,
  AllUploadsComponent,
  DateTimeExampleComponent,

  ...tagPageComponents,
  ...orphanSitePageComponents,
  ...settingsPageComponents,
  ...tagGroupPageComponents,
  ...analysisJobPageComponents,
];
