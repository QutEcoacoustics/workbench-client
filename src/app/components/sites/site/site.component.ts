import { Component, Input, OnInit } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { DateTimeTimezone } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { MapMarkerOption, sanitizeMapMarkers } from "@shared/map/map.component";
import { List } from "immutable";
/**
 * Site Details Component
 */
@Component({
  selector: "app-site",
  templateUrl: "./site.component.html",
  styleUrls: ["./site.component.scss"],
})
class SiteComponent extends PageComponent implements OnInit {
  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public site: Site;
  public recordings: AudioRecording[];
  public recordingsEnd: DateTimeTimezone;
  public recordingsStart: DateTimeTimezone;
  public marker: List<MapMarkerOption>;

  constructor() {
    super();
  }

  public ngOnInit() {
    this.recordings = [];
    this.marker = sanitizeMapMarkers(this.site.getMapMarker());
  }
}

export { SiteComponent };
