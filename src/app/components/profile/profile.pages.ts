import { MyAnnotationsComponent } from "./pages/annotations/my-annotations.component";
import { TheirAnnotationsComponent } from "./pages/annotations/their-annotations.component";
import { MyBookmarksComponent } from "./pages/bookmarks/my-bookmarks.component";
import { TheirBookmarksComponent } from "./pages/bookmarks/their-bookmarks.component";
import { MyEditComponent } from "./pages/my-edit/my-edit.component";
import { MyPasswordComponent } from "./pages/my-password/my-password.component";
import { MyProfileComponent } from "./pages/profile/my-profile.component";
import { TheirProfileComponent } from "./pages/profile/their-profile.component";
import { MyProjectsComponent } from "./pages/projects/my-projects.component";
import { TheirProjectsComponent } from "./pages/projects/their-projects.component";
import { MySitesComponent } from "./pages/sites/my-sites.component";
import { TheirSitesComponent } from "./pages/sites/their-sites.component";
import { TheirEditComponent } from "./pages/their-edit/their-edit.component";

export const myProfilePageComponents = [
  MyPasswordComponent,
  MyProfileComponent,
  MyEditComponent,
  MyProjectsComponent,
  MySitesComponent,
  MyBookmarksComponent,
  MyAnnotationsComponent,
];

export const theirProfilePageComponents = [
  TheirProfileComponent,
  TheirEditComponent,
  TheirProjectsComponent,
  TheirSitesComponent,
  TheirBookmarksComponent,
  TheirAnnotationsComponent,
];
