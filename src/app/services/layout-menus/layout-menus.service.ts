import { Injectable } from '@angular/core';
import { BawApiService } from '../baw-api/baw-api.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutMenusService {
  constructor(
    private _api: BawApiService,
    private _secondaryMenuJson: any,
    private _actionLinksJson: any
  ) {}

  /**
   * Returns the secondary menu links
   * @returns List of secondary links
   */
  secondaryMenu(): SecondaryLink[] {
    if (this._api.loggedIn) {
      return this._secondaryMenuJson.auth.map(function(
        link: SecondaryLink
      ): SecondaryLink {
        return link;
      });
    } else {
      return this._secondaryMenuJson.no_auth.map(function(
        link: SecondaryLink
      ): SecondaryLink {
        return link;
      });
    }
  }

  /**
   * Returns the action title
   * @returns Action title and icon
   */
  actionTitle(): ActionTitle {
    return {
      label: this._actionLinksJson.title.label,
      icon: [
        this._actionLinksJson.title.icon.style,
        this._actionLinksJson.title.icon.glyph
      ]
    };
  }

  /**
   * Returns the action menu links
   * @returns List of action links
   */
  actionLinks(): ActionLink[] {
    if (this._api.loggedIn) {
      return this._actionLinksJson.auth.map(function(
        link: ActionLink
      ): ActionLink {
        return link;
      });
    } else {
      return this._actionLinksJson.no_auth.map(function(
        link: ActionLink
      ): ActionLink {
        return link;
      });
    }
  }
}

export interface SecondaryLink {
  route: string;
  icon: [string, string];
  label: string;
  tooltip: string;
}

export interface ActionLink {
  route: string;
  icon: [string, string];
  label: string;
  tooltip: string;
}
export interface ActionTitle {
  icon: [string, string];
  label: string;
}
