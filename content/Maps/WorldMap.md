---
tags:
  - Map
---
```base
filters: file.hasProperty("marker")
views:
  - type: leaflet-map
    name: MapWorld
    mapName: WorldMap
    image: Blank-1-world-map.png
    minZoom: -4.5
    maxZoom: 1
    defaultZoom: -4.5
    zoomDelta: 0.5
    scale: "0.2"
    height: 400
    unit: km
```
