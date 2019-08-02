import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Card } from "../shared/cards/cards.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  processList: List<Card>;
  projectList: List<Card>;
  postList: List<Card>;
  testing: string;

  constructor() {}

  ngOnInit() {
    this.processList = List([
      {
        title: "Environment",
        description:
          "Faunal vocalisations and other human-audible environmental sounds"
      },
      {
        title: "Acoustic Sensors",
        description:
          "Acoustic sensors record sound in a wide range of environments"
      },
      {
        title: "Annotated Spectrogram",
        description:
          "Practical identification of animal sounds by people and automated detectors. Ecologists use these to answer environmental questions."
      }
    ]);
    this.projectList = List([
      {
        title: "Lorem ipsum",
        image: {
          url:
            "https://www.ecosounds.org/system/projects/images/000/001/094/span3/5616960887_cf01ca55d2_b.jpg?1516664306",
          alt: "Lorem ipsum"
        },
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ",
        link: "https://www.ecosounds.org/projects/1094"
      },
      {
        title: "Lorem ipsum",
        image: {
          url:
            "https://www.ecosounds.org/system/projects/images/000/001/007/span3/IMG_20140529_111723_1_.jpg?1401329277",
          alt: "Oxley Creek Common"
        },
        link: "https://www.ecosounds.org/projects/1007"
      },
      {
        title: "Lorem ipsum",
        image: {
          url:
            "https://www.ecosounds.org/system/projects/images/000/001/029/span3/DSCN0286.JPG?1440543186",
          alt: "Lorem ipsum"
        },
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ",
        link: "https://www.ecosounds.org/projects/1029"
      }
    ]);
  }

  // getActionListTitle(): Readonly<ActionListTitleInterface> {
  //   return Object.freeze({
  //     icon: ['fas', 'home'],
  //     label: 'Home'
  //   });
  // }
  // getHeaderItem(): Readonly<HeaderItemInterface> {
  //   return Object.freeze({
  //     icon: ['fas', 'home'],
  //     label: 'Ecosounds',
  //     uri: new Route('/')
  //   });
  // }
  // getSecondaryItem(): Readonly<SecondaryLinkInterface> {
  //   return Object.freeze({
  //     uri: new Route('/home'),
  //     icon: ['fas', 'home'],
  //     label: 'Home',
  //     tooltip: 'Home page'
  //   });
  // }
}
