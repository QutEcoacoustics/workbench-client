import { Cluster, Marker, SuperClusterAlgorithm } from "@googlemaps/markerclusterer";
import type { ClusterFeature } from "supercluster";

export type WeightedClusterMarker = Marker & {
  clusterWeight?: number;
};

function getMarkerWeight(marker: Marker): number {
  const weightedMarker = marker as WeightedClusterMarker;
  return weightedMarker.clusterWeight ?? 1;
}

class WeightedCluster extends Cluster {
  public override get count(): number {
    return this.markers.reduce((total, marker) => {
      return total + getMarkerWeight(marker);
    }, 0);
  }
}

export class WeightedSuperClusterAlgorithm extends SuperClusterAlgorithm {
  public constructor(options: ConstructorParameters<typeof SuperClusterAlgorithm>[0] = {}) {
    super(options);
  }

  protected override transformCluster(
    feature: ClusterFeature<{ marker: Marker }>,
  ): Cluster {
    const baseCluster = super.transformCluster(feature);

    const weightedCluster = new WeightedCluster({
      markers: baseCluster.markers,
      position: baseCluster.position,
    });

    weightedCluster.marker = baseCluster.marker;

    return weightedCluster;
  }
}
