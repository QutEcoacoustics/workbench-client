import { Component, OnInit } from '@angular/core';
import { List } from 'immutable';
import { Card } from 'src/app/component/shared/cards/cards.component';
import { BawApiService } from 'src/app/services/baw-api/baw-api.service';
import { menus } from './home.component.menu';
import {
  HeaderItemInterface,
  HeaderItem
} from 'src/app/component/shared/header/header.interface';
import {
  Route,
  LayoutMenusInterface,
  SecondaryLinkInterface,
  SecondaryLink,
  LayoutMenus
} from 'src/app/services/layout-menus/layout-menus.interface';

@Component({
  selector: 'app-projects',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ProjectsComponent
  implements OnInit, SecondaryLink, HeaderItem, LayoutMenus {
  projectList: List<Card>;

  constructor(private api: BawApiService) {}

  ngOnInit() {
    this.projectList = List();
    this.api.getProjectList().subscribe(list => {
      if (typeof list === 'string') {
        console.error(list);
      } else {
        console.debug(list);
        this.projectList = List(
          list.data.map(function(project): Card {
            return {
              title: project.name,
              image: {
                url:
                  'https://staging.ecosounds.org/images/project/project_span3.png',
                alt: project.name
              },
              description: project.description,
              link: `https://staging.ecosounds.org/projects/${project.id}`
            };
          })
        );
      }
    });
  }

  getHeaderItem(): Readonly<HeaderItemInterface> {
    return Object.freeze({
      icon: ['fas', 'globe-asia'],
      label: 'Projects',
      uri: new Route('/projects')
    });
  }
  getMenus(): Readonly<LayoutMenusInterface> {
    return menus;
  }
  getSecondaryItem(): Readonly<SecondaryLinkInterface> {
    return Object.freeze({
      icon: ['fas', 'globe-asia'],
      label: 'Projects',
      uri: new Route('/projects'),
      tooltip: 'View projects I have access too'
    });
  }
}
