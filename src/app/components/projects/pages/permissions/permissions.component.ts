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
import { PermissionLevel } from "@interfaces/apiInterfaces";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Permission } from "@models/Permission";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { ISelectableItem } from "@shared/items/selectable-items/selectable-items.component";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  BehaviorSubject,
  filter,
  map,
  mergeMap,
  Observable,
  of,
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
  public anonymousPermission: Permission;
  public usersPermission: Permission;
  public selectedUser: User;

  public permissionsMatchingUsername: Permission[];

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
      this.anonymousPermission = permission;
    });
    getLevel({ filter: { allowLoggedIn: { eq: true } } }, (permission) => {
      this.usersPermission = permission;
    });

    this.reloadPermissions$.next();
  }

  public doesUserAlreadyHavePermissions(user: User): boolean {
    return this.permissionsMatchingUsername.some(
      (permission) => permission.userId === user.id
    );
  }

  public getPermissions = (
    filters: Filters<Permission>
  ): Observable<Permission[]> =>
    this.permissionsApi.filter(filters, this.project);

  public getUsers = (user: User | string) => {
    let users: User[];

    return this.accountsApi
      .filter({
        // Show a maximum of 10 results
        paging: { items: 10 },
        filter: {
          // Filter out admin users
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
          this.permissionsMatchingUsername = permissionsForUsers;
          return users;
        })
      );
  };

  public highestPermission(user: Permission): string {
    const hasLevel = (level: PermissionLevel): boolean =>
      [
        this.anonymousPermission?.level,
        this.usersPermission?.level,
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

  public getPermissionForUser(userId: User | number): Permission {
    return this.permissionsMatchingUsername?.find(
      (permission) => permission.userId === ((userId as User)?.id ?? userId)
    );
  }

  public createNewPermission(user: User, selection: number): void {
    const successMsg = `Successfully created permissions for ${user.userName}`;
    const level = this.individualOptions[selection].value;
    const permission = new Permission({
      userId: user.id,
      allowAnonymous: false,
      allowLoggedIn: false,
    });

    if (selection === this.selectionIndex.none) {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.destroyPermission(permission).subscribe(() => {
        this.notifications.success(successMsg);
        this.selectedUser = undefined;
        this.updateTable();
      });
    } else {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.updatePermission(permission, level).subscribe(() => {
        this.notifications.success(successMsg);
        this.selectedUser = undefined;
        this.updateTable();
      });
    }
  }

  public updateExistingPermission(
    permission: Permission,
    selection: number
  ): void {
    // TODO It would be nice to use the username
    const successMsg = "Successfully updated user permission";
    const level = this.individualOptions[selection].value;

    if (selection === this.selectionIndex.none) {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.destroyPermission(permission).subscribe(() => {
        this.notifications.success(successMsg);
        this.selectedUser = undefined;
        this.updateTable();
      });
    } else {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.updatePermission(permission, level).subscribe(() => {
        this.notifications.success(successMsg);
        this.updateTable();
      });
    }
  }

  public updateAnonymousPermission(selection: number): void {
    const successMsg = "Successfully updated visitor permission";
    const level = this.anonymousOptions[selection].value;
    const permission = new Permission(
      {
        id: this.anonymousPermission?.id,
        userId: null,
        allowAnonymous: true,
        allowLoggedIn: false,
      },
      this.injector
    );

    if (selection === this.selectionIndex.none) {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.destroyPermission(permission).subscribe(() => {
        this.notifications.success(successMsg);
        this.anonymousPermission = undefined;
      });
    } else {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.updatePermission(permission, level).subscribe(
        (result: Permission) => {
          this.notifications.success(successMsg);
          this.anonymousPermission = result;
        }
      );
    }
  }

  public updateUserPermission(selection: number): void {
    const level = this.individualOptions[selection].value;
    const successMsg =
      "Successfully updated permissions for all logged in users";
    const permission = new Permission(
      {
        id: this.usersPermission?.id,
        userId: null,
        allowAnonymous: false,
        allowLoggedIn: true,
      },
      this.injector
    );
    if (selection === this.selectionIndex.none) {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.destroyPermission(permission).subscribe(() => {
        this.notifications.success(successMsg);
        this.usersPermission = undefined;
      });
    } else {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.updatePermission(permission, level).subscribe(
        (result: Permission) => {
          this.notifications.success(successMsg);
          this.usersPermission = result;
        }
      );
    }
  }

  /** Create or update a permission based on if the id property exists */
  private updatePermission(
    permission: Permission,
    level: PermissionLevel
  ): Observable<Permission> {
    return this.isUserOnlyOwnerOfProject(permission).pipe(
      filter((isOnlyOwner) => !isOnlyOwner),
      mergeMap(() => {
        permission.level = level;
        // If we know the id for this permission, use it
        permission.id =
          permission.id ?? this.getPermissionForUser(permission.userId)?.id;

        // Choose between create or update based on if an id exists
        return isInstantiated(permission.id)
          ? this.permissionsApi.update(permission, this.project)
          : this.permissionsApi.create(permission, this.project);
      })
    );
  }

  /** Destroy a permission */
  private destroyPermission(
    permission: Permission
  ): Observable<void | Permission> {
    return this.isUserOnlyOwnerOfProject(permission).pipe(
      filter((isOnlyOwner) => !isOnlyOwner),
      mergeMap(() => this.permissionsApi.destroy(permission, this.project))
    );
  }

  private isUserOnlyOwnerOfProject(
    permission: Permission
  ): Observable<boolean> {
    if (permission.level !== PermissionLevel.owner) {
      return of(false);
    }

    return this.permissionsApi
      .filter(
        {
          paging: { items: 1 },
          filter: {
            level: { eq: PermissionLevel.owner },
            userId: { notEq: permission.userId },
          },
        },
        this.project
      )
      .pipe(
        map((permissions) => {
          if (permissions.length === 0) {
            this.notifications.error(
              "This is the only owner of the project, their permissions cannot be changed unless another owner is appointed."
            );
            return true;
          }
          return false;
        })
      );
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
