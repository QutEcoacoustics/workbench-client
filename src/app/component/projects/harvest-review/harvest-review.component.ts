import { Component, OnInit } from "@angular/core";
import { TreeNode } from "primeng/api/treenode";

@Component({
  selector: "app-project-harvest-review",
  templateUrl: "./harvest-review.component.html",
  styleUrls: ["./harvest-review.component.scss"],
})
export class HarvestReviewComponent implements OnInit {
  public files: TreeNode[] = [
    {
      data: {
        name: "Documents",
        size: "75kb",
        type: "Folder",
      },
      children: [
        {
          data: {
            name: "Work",
            size: "55kb",
            type: "Folder",
          },
          children: [
            {
              data: {
                name: "Expenses.doc",
                size: "30kb",
                type: "Document",
              },
            },
            {
              data: {
                name: "Resume.doc",
                size: "25kb",
                type: "Resume",
              },
            },
          ],
        },
        {
          data: {
            name: "Home",
            size: "20kb",
            type: "Folder",
          },
          children: [
            {
              data: {
                name: "Invoices",
                size: "20kb",
                type: "Text",
              },
            },
          ],
        },
      ],
    },
    {
      data: {
        name: "Pictures",
        size: "150kb",
        type: "Folder",
      },
      children: [
        {
          data: {
            name: "barcelona.jpg",
            size: "90kb",
            type: "Picture",
          },
        },
        {
          data: {
            name: "primeui.png",
            size: "30kb",
            type: "Picture",
          },
        },
        {
          data: {
            name: "optimus.jpg",
            size: "30kb",
            type: "Picture",
          },
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  // private generateNodes(parent: TreeModel) {
  //   const children = [];
  //   for (let i = 0; i < 50; i++) {
  //     children.push({
  //       value: "recording_" + i,
  //     });
  //   }

  //   parent.children = children;
  // }
}

interface Node {
  id: number;
  name: string;
  children?: Node[];
}
