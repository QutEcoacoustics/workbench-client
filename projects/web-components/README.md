# Baw Web Components

## Usage

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@ecoacoustics/baw-web-components"></script>
```

Full page example:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Baw Web Components CDN Example</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ecoacoustics/baw-web-components"></script>
  </head>

  <body>
    <oe-event-map></oe-event-map>

    <script type="module">
        const eventMap = document.querySelector("oe-event-map");
        eventMap.events = [
          {
            siteId: 3605,
            eventCount: 67,
            latitude: -27.4975,
            longitude: 153.0136,
          },
          {
            siteId: 3606,
            eventCount: 42,
            latitude: -27.4773,
            longitude: 153.0271,
          },
          {
            siteId: 3873,
            eventCount: 9,
            latitude: 4.522871,
            longitude: 6.118915,
          },
        ];
    </script>
  </body>
</html>
```
