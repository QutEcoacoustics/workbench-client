import { Component, OnInit } from '@angular/core';
import { List } from 'immutable';
import { Card } from 'src/app/component/shared/cards/cards.component';
import { BawApiService } from 'src/app/services/baw-api/baw-api.service';
import { MenusService } from './menus.service';

@Component({
  selector: 'app-projects',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectList: List<Card>;
  secondaryLinks: {
    route: string;
    icon: [string, string];
    label: string;
    tooltip: string;
  }[];
  actionTitle: {
    icon: [string, string];
    label: string;
  };
  actionLinks: {
    route: string;
    icon: [string, string];
    label: string;
  }[];

  constructor(private api: BawApiService, private menus: MenusService) {}

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
    this.secondaryLinks = this.menus.secondaryMenu();
    this.actionTitle = this.menus.actionTitle();
    this.actionLinks = this.menus.actionLinks();
  }
}
