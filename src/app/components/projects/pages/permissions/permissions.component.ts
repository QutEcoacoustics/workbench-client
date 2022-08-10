import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import { Filters } from "@baw-api/baw-api.service";
import { PermissionsService } from "@baw-api/permissions/permissions.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { theirProfileMenuItem } from "@components/profile/profile.menus";
import {
  editProjectPermissionsMenuItem,
  projectCategory,
} from "@components/projects/projects.menus";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Id, PermissionLevel } from "@interfaces/apiInterfaces";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { IPermission, Permission } from "@models/Permission";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { ISelectableItem } from "@shared/items/selectable-items/selectable-items.component";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  BehaviorSubject,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from "rxjs";
import { projectMenuItemActions } from "../details/details.component";

const projectKey = "project";

@Component({
  selector: "baw-project-permissions",
  templateUrl: "permissions.component.html",
  styleUrls: ["permissions.component.scss"],
})
class PermissionsComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit
{
  public project: Project;
  public anonymousUser: Permission;
  public loggedInUser: Permission;
  public selectedUser: User;

  public disabledTypeaheadUsers: Id[];

  public userIcon: IconProp = theirProfileMenuItem.icon;
  public helpIcon: IconProp = ["fas", "info-circle"];

  public filters$ = new BehaviorSubject<Filters<Permission>>({
    filter: { userId: { notEq: null } },
  });

  private reloadPermissions$ = new Subject<void>();
  private selectionIndex = {
    [PermissionLevel.owner]: 3,
    [PermissionLevel.writer]: 2,
    [PermissionLevel.reader]: 1,
    none: 0,
  };

  public individualOptions: ISelectableItem[] = [
    { label: "None", value: "none" },
    { label: "Reader", value: PermissionLevel.reader },
    { label: "Writer", value: PermissionLevel.writer },
    { label: "Owner", value: PermissionLevel.owner },
  ];
  public anonymousOptions: ISelectableItem[] = [
    { label: "No access (none)", value: "none" },
    { label: "Reader access", value: PermissionLevel.reader },
  ];
  public userOptions: ISelectableItem[] = [
    ...this.anonymousOptions,
    { label: "Writer access", value: PermissionLevel.writer },
  ];

  public constructor(
    private notifications: ToastrService,
    private permissionsApi: PermissionsService,
    private accountsApi: AccountsService,
    private route: ActivatedRoute,
    private injector: Injector
  ) {
    super();
  }

  public ngOnInit(): void {
    const projectModel: ResolvedModel<Project> =
      this.route.snapshot.data[projectKey];
    this.project = projectModel.model;

    const getLevel = (
      filters: Filters<Permission>,
      next: (permission: Permission) => void
    ) =>
      this.reloadPermissions$
        .pipe(
          switchMap(() => this.permissionsApi.filter(filters, this.project)),
          map((permissions) => permissions[0]),
          takeUntil(this.unsubscribe)
        )
        .subscribe(next);

    getLevel({ filter: { allowAnonymous: { eq: true } } }, (permission) => {
      this.anonymousUser = permission;
    });
    getLevel({ filter: { allowLoggedIn: { eq: true } } }, (permission) => {
      this.loggedInUser = permission;
    });

    this.reloadPermissions$.next();
  }

  public doesUserAlreadyHavePermissions(user: User): boolean {
    return this.disabledTypeaheadUsers.includes(user.id);
  }

  public getPermissions = (
    filters: Filters<Permission>
  ): Observable<Permission[]> =>
    this.permissionsApi.filter(filters, this.project);

  public getUsers = (user: User | string) => {
    let users: User[];

    return this.accountsApi
      .filter({
        paging: { items: 10 },
        filter: {
          rolesMask: { eq: 2 },
          userName: { contains: (user as User)?.userName || (user as string) },
        },
      })
      .pipe(
        switchMap((_users) => {
          users = _users;
          return this.permissionsApi.filter(
            { filter: { userId: { in: users.map((_user) => _user.id) } } },
            this.project
          );
        }),
        map((permissionsForUsers: Permission[]) => {
          this.disabledTypeaheadUsers = permissionsForUsers.map(
            (permission) => permission.userId
          );
          return users;
        })
      );
  };

  public highestPermission(user: Permission): string {
    const hasLevel = (level: PermissionLevel): boolean =>
      [
        this.anonymousUser?.level,
        this.loggedInUser?.level,
        user.level,
      ].includes(level);

    if (hasLevel(PermissionLevel.owner)) {
      return "Owner";
    } else if (hasLevel(PermissionLevel.writer)) {
      return "Writer";
    } else if (hasLevel(PermissionLevel.reader)) {
      return "Reader";
    } else {
      return "None";
    }
  }

  public updateFilter(input: string): void {
    this.filters$.next({
      filter: { ["users.userName" as any]: { contains: input } },
    });
  }

  public getSelectionIndex(level: PermissionLevel): number {
    return isInstantiated(level)
      ? this.selectionIndex[level]
      : this.selectionIndex.none;
  }

  public createUserPermission(user: User, selection: number): void {
    this.updateUserPermission(
      this.individualOptions,
      selection,
      { userId: user.id, allowAnonymous: false, allowLoggedIn: false },
      () => {
        this.notifications.success(
          `Successfully created permissions for ${user.userName}`
        );
        // Update table so that it shows the new value
        this.updateTable();
      }
    );
  }

  public updateSingleUserPermission(user: Permission, selection: number): void {
    this.updateUserPermission(this.userOptions, selection, user, () => {
      // TODO It would be nice to use the username, but it is not available
      this.notifications.success("Successfully updated user permission");
      this.updateTable();
    });
  }

  public updateAnonymousUserPermission(selection: number): void {
    const anonymousPermissions = {
      userId: null,
      allowAnonymous: true,
      allowLoggedIn: false,
    };

    this.updateUserPermission(
      this.anonymousOptions,
      selection,
      this.anonymousUser ?? anonymousPermissions,
      (permission: Permission) => {
        this.notifications.success("Successfully updated visitor permissions");
        this.anonymousUser = permission;
      }
    );
  }

  public updateLoggedInUserPermission(selection: number): void {
    const loggedInPermissions = {
      userId: null,
      allowAnonymous: false,
      allowLoggedIn: true,
    };

    this.updateUserPermission(
      this.individualOptions,
      selection,
      this.loggedInUser ?? loggedInPermissions,
      (permission: Permission) => {
        this.notifications.success(
          "Successfully updated logged in user permissions"
        );
        this.loggedInUser = permission;
      }
    );
  }

  private updateUserPermission(
    options: ISelectableItem[],
    selection: number,
    basePermission: Permission | IPermission,
    onSuccess: (permission?: Permission) => void
  ): void {
    if (selection === this.selectionIndex.none) {
      this.permissionsApi
        .destroy(basePermission as Permission, this.project)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(onSuccess);
      return;
    }

    const level = options[selection].value;
    const permission = new Permission(
      { ...basePermission, id: basePermission?.id, level },
      this.injector
    );

    console.log("Updating : ", permission, basePermission);

    // Choose between create or update based on if an id exists
    (isInstantiated(basePermission?.id)
      ? this.permissionsApi.update(permission, this.project)
      : this.permissionsApi.create(permission, this.project)
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(onSuccess);
  }

  private updateTable() {
    this.filters$.next(this.filters$.value);
  }
}

PermissionsComponent.linkToRoute({
  category: projectCategory,
  pageRoute: editProjectPermissionsMenuItem,
  menus: {
    actions: List(projectMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { PermissionsComponent };
