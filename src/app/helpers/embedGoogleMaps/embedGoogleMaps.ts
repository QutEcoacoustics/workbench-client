export default function embedGoogleMaps(key?: string) {
  let googleMapsUrl = `https://maps.googleapis.com/maps/api/js`;
  if (key) {
    googleMapsUrl += "?key=" + key;
  }

  const node = document.createElement("script");
  node.src = googleMapsUrl;
  node.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(node);
}
