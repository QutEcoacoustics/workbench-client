import { Injectable } from "@angular/core";
import { MapService } from "./map.service";

/**
 * Mock for the Map Service
 */
@Injectable()
export class MockMapService extends MapService {
  protected loadMap() {
    // Do Nothing
  }
}
