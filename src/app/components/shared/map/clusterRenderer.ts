import { ClusterStats, Renderer, Cluster } from "@googlemaps/markerclusterer"
import { MapMarkerOptions } from "@services/maps/maps.service";

// Adapted from the @googlemaps/js-markerclusterer default cluster renderer
// https://github.com/googlemaps/js-markerclusterer/blob/8acb046d9b5/src/renderer.ts#L107
export class ClusterRenderer implements Renderer {
  public render(
    cluster: Cluster,
    _stats: ClusterStats,
    map: google.maps.Map
  ): google.maps.marker.AdvancedMarkerElement {
    const { position, markers } = cluster;
    // Our custom MapMarkerOptions type has a clusterWeight property which allows
    // us to modify how much the marker counts for when clustering.
    // This is useful for clustering groups such as an aggregate of events where
    // one marker may represent hundreds of events.
    let clusterWeight = 0;
    for (const marker of markers) {
      // If there is no clusterWeight on the marker, we default to using a weight
      // of one.
      clusterWeight += (marker as any).clusterWeight ?? 1;
    }

    const svg = `
      <svg fill="var(--baw-primary)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
        <circle cx="120" cy="120" opacity=".6" r="70" />
        <circle cx="120" cy="120" opacity=".3" r="90" />
        <circle cx="120" cy="120" opacity=".2" r="110" />
        <text
          x="50%"
          y="50%"
          fill="var(--baw-primary-contrast)"
          text-anchor="middle"
          font-size="50"
          dominant-baseline="middle"
          font-family="roboto,arial,sans-serif"
        >${clusterWeight}</text>
      </svg>
    `;

    const title = `Cluster of ${clusterWeight} markers`;
    const zIndex: number = Number(google.maps.Marker.MAX_ZINDEX) + clusterWeight;

    const parser = new DOMParser();
    const markerContent = parser.parseFromString(
      svg,
      "image/svg+xml"
    ).documentElement;
    markerContent.setAttribute("transform", "translate(0 25)");

    return new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      zIndex,
      title,
      content: markerContent,
    });
  }
}
