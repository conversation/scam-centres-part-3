export const ARTICLEWIDTH = {
  maxWidth: 750,
  widthCalc: "",
};

export const FIGUREWIDTH = {
  maxWidth: ARTICLEWIDTH.maxWidth * 1.2,
  base: "100%",
  widthCalc: "",
};

ARTICLEWIDTH.widthCalc = `min(100% - 40px, ${ARTICLEWIDTH.maxWidth}px)`;
FIGUREWIDTH.widthCalc = `min(100% - 40px, ${FIGUREWIDTH.maxWidth}px)`;

export const PINWIDTH = { base: ARTICLEWIDTH.widthCalc };

export const breakpoints: {
  media: string;
  sizingName: string;
}[] = [
  { media: "(max-width: 699px)", sizingName: "mobile" },
  {
    media: "(orientation: landscape) and (max-width: 979px)",
    sizingName: "tabletLandscape",
  },
  { media: "(min-width: 700px) and (max-width: 979px)", sizingName: "tablet" },
  { media: "(min-width: 980px) and (max-width: 1799px)", sizingName: "laptop" },
  { media: "(min-width: 1800px)", sizingName: "desktop" },
];

export const widthsQualities = [
  { w: 700, q: 15, dpr: 3 },
  { w: 960, q: 30, dpr: 2 },
  { w: 1400, q: 30, dpr: 2 },
  { w: 2100, q: 45, dpr: 1 },
];

export type MapConfigType = {
  scrollSection: string;
  container: string;
  insetContainer: string;
  style: string;
  accessToken: string;
  showMarkers: boolean;
  markerColor: string;
  inset: boolean;
  theme: string;
  use3dTerrain: boolean;
  auto: boolean;
};

export type MapLocationType = {
  mapAnimation: string;
  rotateAnimation: boolean;
  rotationDirection: "CW" | "CCW";
  onChapterEnter: {
    layer: string;
    opacity: number;
    duration?: number;
  }[];
  centerLocation: {
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
    speed: number;
  };
};

export const config: MapConfigType = {
  scrollSection: "map1",
  container: "map1",
  insetContainer: "map1_mapInset",
  style: "mapbox://styles/theconversation/clx1vftez01o901po1n5l7okg",
  accessToken:
    "pk.eyJ1IjoidGhlY29udmVyc2F0aW9uIiwiYSI6ImNsbmszZXA1NzF0Mmcyam1rcjhxenA5aGMifQ.To6VqAJCNtd1T0Xs99l6LQ",
  showMarkers: false,
  markerColor: "#3FB1CE",
  inset: true,
  theme: "dark",
  use3dTerrain: false,
  auto: false,
};

export const mapLocations: MapLocationType[] = [
  {
    mapAnimation: "flyTo",
    rotateAnimation: false,
    rotationDirection: "CW",
    onChapterEnter: [
      {
        layer: "Dubai-Laos-points",
        opacity: 0,
      },
      {
        layer: "Dubai-Laos-line",
        opacity: 0,
      },
      {
        layer: "laos-boundaries",
        opacity: 0,
      },
    ],
    centerLocation: {
      center: [55.287, 25.253],
      zoom: 4.5,
      pitch: 45.0,
      bearing: 0.0,
      speed: 0.4,
    },
  },
  {
    mapAnimation: "flyTo",
    rotateAnimation: false,
    rotationDirection: "CW",

    onChapterEnter: [
      {
        layer: "Dubai-Laos-points",
        opacity: 0,
      },
      {
        layer: "Dubai-Laos-line",
        opacity: 0,
      },
      {
        layer: "laos-boundaries",
        opacity: 0,
        duration: 2000,
      },
    ],
    centerLocation: {
      center: [55.287, 25.253],
      zoom: 10,
      pitch: 50.0,
      bearing: 90.0,
      speed: 0.4,
    },
  },
  {
    mapAnimation: "flyTo",
    rotateAnimation: false,
    rotationDirection: "CCW",
    onChapterEnter: [
      {
        layer: "Dubai-Laos-points",
        opacity: 1,
        duration: 2000,
      },
      {
        layer: "Dubai-Laos-line",
        opacity: 1,
        duration: 2000,
      },
      {
        layer: "laos-boundaries",
        opacity: 0.3,
        duration: 2000,
      },
      {
        layer: "golden-triangle-zone",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Laos-to-golden-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Laos-to-golden-points",
        opacity: 0,
        duration: 2000,
      },
    ],

    centerLocation: {
      center: [102.61, 17.96],
      zoom: 7,
      pitch: 45,
      bearing: 0,
      speed: 0.6,
    },
  },
  {
    mapAnimation: "flyTo",
    rotateAnimation: false,
    rotationDirection: "CW",
    onChapterEnter: [
      {
        layer: "Dubai-Laos-points",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Dubai-Laos-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "laos-boundaries",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "golden-triangle-zone",
        opacity: 0.4,
        duration: 2000,
      },
      {
        layer: "Laos-to-golden-line",
        opacity: 1,
        duration: 2000,
      },
      {
        layer: "Laos-to-golden-points",
        opacity: 1,
        duration: 2000,
      },
      {
        layer: "myanmar-boundaries",
        opacity: 0,
        duration: 2000,
      },
    ],

    centerLocation: {
      center: [100.105, 20.34],
      zoom: 10.5,
      pitch: 0.0,
      bearing: 0,
      speed: 0.4,
    },
  },
  {
    mapAnimation: "flyTo",
    rotateAnimation: true,
    rotationDirection: "CW",
    onChapterEnter: [
      {
        layer: "Dubai-Laos-points",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Dubai-Laos-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "laos-boundaries",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "golden-triangle-zone",
        opacity: 0.4,
        duration: 2000,
      },
      {
        layer: "Laos-to-golden-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Laos-to-golden-points",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "myanmar-boundaries",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Golden-to-myanmar-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Golden-to-myanmar-points",
        opacity: 0,
        duration: 2000,
      },
    ],

    centerLocation: {
      center: [100.105, 20.34],
      zoom: 13,
      pitch: 45,
      bearing: 60,
      speed: 0.4,
    },
  },
  {
    mapAnimation: "flyTo",
    rotateAnimation: false,
    rotationDirection: "CW",
    onChapterEnter: [
      {
        layer: "Dubai-Laos-points",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Dubai-Laos-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "laos-boundaries",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "golden-triangle-zone",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "myanmar-boundaries",
        opacity: 0.4,
        duration: 2000,
      },
      {
        layer: "Golden-to-myanmar-line",
        opacity: 1,
        duration: 2000,
      },
      {
        layer: "Golden-to-myanmar-points",
        opacity: 1,
        duration: 2000,
      },

      {
        layer: "Myanmar-Uganda-points",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Myanmar-Uganda-line",
        opacity: 0,
        duration: 2000,
      },
    ],
    centerLocation: {
      center: [99.89, 20.45],
      zoom: 12,
      pitch: 0.0,
      bearing: 0.0,
      speed: 0.2,
    },
  },
  {
    mapAnimation: "flyTo",
    rotateAnimation: false,
    rotationDirection: "CW",
    onChapterEnter: [
      {
        layer: "Dubai-Laos-points",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Dubai-Laos-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "laos-boundaries",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "golden-triangle-zone",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "myanmar-boundaries",
        opacity: 0,
        duration: 2000,
      },

      {
        layer: "Myanmar-Uganda-points",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Myanmar-Uganda-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Golden-to-myanmar-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Golden-to-myanmar-points",
        opacity: 0,
        duration: 2000,
      },
    ],
    centerLocation: {
      center: [99.89, 20.45],
      zoom: 12,
      pitch: 0.0,
      bearing: 0.0,
      speed: 0.2,
    },
  },
  {
    mapAnimation: "flyTo",
    rotateAnimation: false,
    rotationDirection: "CW",
    onChapterEnter: [
      {
        layer: "Dubai-Laos-points",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Dubai-Laos-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "laos-boundaries",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "golden-triangle-zone",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "myanmar-boundaries",
        opacity: 0,
        duration: 2000,
      },

      {
        layer: "Myanmar-Uganda-points",
        opacity: 1,
        duration: 2000,
      },
      {
        layer: "Myanmar-Uganda-line",
        opacity: 1,
        duration: 2000,
      },
      {
        layer: "Golden-to-myanmar-line",
        opacity: 0,
        duration: 2000,
      },
      {
        layer: "Golden-to-myanmar-points",
        opacity: 0,
        duration: 2000,
      },
    ],
    centerLocation: {
      center: [32.57, 0.31],
      zoom: 6,
      pitch: 0.0,
      bearing: 0.0,
      speed: 0.4,
    },
  },
];

export type LayerType =
  | "fill"
  | "line"
  | "circle"
  | "symbol"
  | "raster"
  | "fill-extrusion"
  | "heatmap";

export type Layer = {
  layer: string;
  opacity: number;
  duration?: number;
};

export type LayerTypes = {
  [key in LayerType]: string[];
};
