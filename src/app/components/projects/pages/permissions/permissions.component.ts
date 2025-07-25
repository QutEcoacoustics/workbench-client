import { Component, Inject, OnInit } from "@angular/core";
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
import { licenseWidgetMenuItem, permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Permission } from "@models/Permission";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { ISelectableItem , SelectableItemsComponent } from "@shared/items/selectable-items/selectable-items.component";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import {
  BehaviorSubject,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  takeUntil,
} from "rxjs";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { NgbHighlight, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ModelSelectorComponent } from "@shared/model-selector/model-selector.component";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { DatatablePaginationDirective } from "@directives/datatable/pagination/pagination.directive";
import { LoadingComponent } from "@shared/loading/loading.component";
import { UrlDirective } from "@directives/url/url.directive";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { projectMenuItemActions } from "../details/details.component";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";

const projectKey = "project";

type NullablePermission = PermissionLevel | "none";

@Component({
  selector: "baw-project-permissions",
  templateUrl: "./permissions.component.html",
  styleUrl: "./permissions.component.scss",
  imports: [
    SelectableItemsComponent,
    NgbHighlight,
    ModelSelectorComponent,
    DebouncedInputDirective,
    NgxDatatableModule,
    DatatableDefaultsDirective,
    DatatablePaginationDirective,
    FaIconComponent,
    LoadingComponent,
    UrlDirective,
    NgbTooltip,
    IsUnresolvedPipe,
  ],
})
class PermissionsComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit
{
  public project: Project;
  /** Permissions for anonymous guests */
  public anonymousPermission: Permission;
  /** Base permission for all users */
  public usersPermission: Permission;
  /** Current selected user by typeahead */
  public selectedUser: User;
  /** Permissions for users in typeahead */
  public permissionsMatchingUsername: Permission[];

  public userIcon: IconProp = theirProfileMenuItem.icon;
  public helpIcon: IconProp = ["fas", "info-circle"];

  /** Filters for permissions table */
  public filters$ = new BehaviorSubject<Filters<Permission>>({
    // Filter out anonymous and logged in user permissions
    filter: { userId: { notEq: null } },
  });

  /** Permission level options for individual users */
  public individualOptions: ISelectableItem<NullablePermission>[] = [
    { label: "None", value: "none" },
    { label: "Reader", value: PermissionLevel.reader },
    { label: "Writer", value: PermissionLevel.writer },
    { label: "Owner", value: PermissionLevel.owner },
  ];
  /** Permission level options for anonymous guests */
  public anonymousOptions: ISelectableItem<NullablePermission>[] = [
    { label: "No access (none)", value: "none" },
    { label: "Reader access", value: PermissionLevel.reader },
  ];
  /** Permission level options for any logged in user */
  public userOptions: ISelectableItem<NullablePermission>[] = [
    ...this.anonymousOptions,
    { label: "Writer access", value: PermissionLevel.writer },
  ];

  public constructor(
    private notifications: ToastService,
    private permissionsApi: PermissionsService,
    private accountsApi: AccountsService,
    private route: ActivatedRoute,
    @Inject(ASSOCIATION_INJECTOR) private injector: AssociationInjector
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
      this.permissionsApi
        .filter(filters, this.project)
        .pipe(
          map((permissions) => permissions[0]),
          takeUntil(this.unsubscribe)
        )
        .subscribe(next);

    // Find the levels for anonymous guests and users
    getLevel({ filter: { allowAnonymous: { eq: true } } }, (permission) => {
      this.anonymousPermission = permission;
    });
    getLevel({ filter: { allowLoggedIn: { eq: true } } }, (permission) => {
      this.usersPermission = permission;
    });
  }

  /** Determine if user in typeahead already has permissions */
  public doesUserAlreadyHavePermissions(user: User): boolean {
    return this.permissionsMatchingUsername.some(
      (permission) => permission.userId === user.id
    );
  }

  /** Get permissions for current table page */
  public getPermissions = (
    filters: Filters<Permission>
  ): Observable<Permission[]> =>
    this.permissionsApi.filter(filters, this.project);

  /** Get users for typeahead, this also updates permissionsMatchingUsername */
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

  /** Determine highest permission for user */
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

  /** Update table filter */
  public updateFilter(input: string): void {
    this.filters$.next({
      filter: { ["users.userName" as any]: { contains: input } },
    });
  }

  /** Get permissions for a user which is in the typeahead options */
  public getPermissionForUser(userId: User | number): Permission {
    return this.permissionsMatchingUsername?.find(
      (permission) => permission.userId === ((userId as User)?.id ?? userId)
    );
  }

  /** Create/update permissions for a new user */
  public createNewPermission(user: User, selection: NullablePermission): void {
    const successMsg = `Successfully created permissions for ${user.userName}`;
    const permission = new Permission({
      userId: user.id,
      allowAnonymous: false,
      allowLoggedIn: false,
    });

    if (selection === "none") {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.destroyPermission(permission).subscribe(() => {
        this.notifications.success(successMsg);
        this.selectedUser = undefined;
        this.updateTable();
      });
    } else {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.updatePermission(permission, selection).subscribe(() => {
        this.notifications.success(successMsg);
        this.selectedUser = undefined;
        this.updateTable();
      });
    }
  }

  /** Update permissions for existing user */
  public updateExistingPermission(
    permission: Permission,
    selection: NullablePermission,
  ): void {
    // TODO It would be nice to use the username
    const successMsg = "Successfully updated user permission";

    if (selection === "none") {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.destroyPermission(permission).subscribe(() => {
        this.notifications.success(successMsg);
        this.selectedUser = undefined;
        this.updateTable();
      });
    } else {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.updatePermission(permission, selection).subscribe(() => {
        this.notifications.success(successMsg);
        this.updateTable();
      });
    }
  }

  /** Update anonymous permissions */
  public updateAnonymousPermission(selection: NullablePermission): void {
    const successMsg = "Successfully updated visitor permission";
    const permission = new Permission(
      {
        id: this.anonymousPermission?.id,
        userId: null,
        allowAnonymous: true,
        allowLoggedIn: false,
      },
      this.injector
    );

    if (selection === "none") {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.destroyPermission(permission).subscribe(() => {
        this.notifications.success(successMsg);
        this.anonymousPermission = undefined;
      });
    } else {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.updatePermission(permission, selection).subscribe(
        (result: Permission) => {
          this.notifications.success(successMsg);
          this.anonymousPermission = result;
        }
      );
    }
  }

  /** Update base permissions for all users */
  public updateUserPermission(selection: NullablePermission): void {
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

    if (selection === "none") {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.destroyPermission(permission).subscribe(() => {
        this.notifications.success(successMsg);
        this.usersPermission = undefined;
      });
    } else {
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      this.updatePermission(permission, selection).subscribe(
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

  /** Determine if the permissions are for the only remaining owner */
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

  /** Force update the table */
  private updateTable() {
    this.filters$.next(this.filters$.value);
  }
}

PermissionsComponent.linkToRoute({
  category: projectCategory,
  pageRoute: editProjectPermissionsMenuItem,
  menus: {
    actions: List(projectMenuItemActions),
    actionWidgets: List([
      permissionsWidgetMenuItem,
      licenseWidgetMenuItem,
    ]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { PermissionsComponent };
