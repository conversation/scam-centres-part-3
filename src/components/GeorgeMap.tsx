import mapboxgl from "mapbox-gl";
import { useRef } from "react";
import {
  ScrollBackground,
  ScrollForeground,
  ScrollSection,
  ScrollTextChapter,
} from "./ScrollSection";
import { useGSAP } from "@gsap/react";

export default function GeorgeMap() {
  const mapContainerRef = useRef<HTMLDivElement>();
  const mapRef = useRef<mapboxgl.Map>();

  function createMapboxMap(config, mapLocations) {
    function setLayerOpacity(layer) {
      const layerTypes = {
        fill: ["fill-opacity"],
        line: ["line-opacity"],
        circle: ["circle-opacity", "circle-stroke-opacity"],
        symbol: ["icon-opacity", "text-opacity"],
        raster: ["raster-opacity"],
        "fill-extrusion": ["fill-extrusion-opacity"],
        heatmap: ["heatmap-opacity"],
      };

      const layerType = map.getLayer(layer.layer).type;
      const paintProps = layerTypes[layerType];

      paintProps.forEach(function (prop) {
        const options = {};
        if (layer.duration) {
          let transitionProp = prop + "-transition";
          options.duration = layer.duration;
          map.setPaintProperty(layer.layer, transitionProp, options);
        }
        map.setPaintProperty(layer.layer, prop, layer.opacity, options);
      });
    }

    mapboxgl.accessToken = config.accessToken;

    const transformRequest = (url) => {
      const hasQuery = url.indexOf("?") !== -1;
      const suffix = hasQuery
        ? "&pluginName=scrollytellingV2"
        : "?pluginName=scrollytellingV2";
      return {
        url: url + suffix,
      };
    };

    let initMapOptions = {
      container: config.container,
      style: config.style,
      interactive: false,
      transformRequest: transformRequest,
      projection: config.projection,
    };

    if (mapLocations[0].centerLocation) {
      initMapOptions = {
        ...initMapOptions,
        ...mapLocations[0].centerLocation,
      };
    } else {
      initInsetOptions.bounds = mapLocations[0].boundsLocation.bounds;
      initInsetOptions.fitBoundsOptions =
        mapLocations[0].boundsLocation.fitBoundsOptions;
    }

    const map = new mapboxgl.Map(initMapOptions);

    function calculateCornerCoordinates(center, width, height, angle) {
      const earthCircumference = 40075017; // Earth's circumference in meters
      const halfWidth = width / 2;
      const halfHeight = height / 2;

      // Convert angle to radians
      const angleRad = (angle * Math.PI) / 180;

      // Calculate the change in longitude and latitude for the given width and height
      const deltaLng = (halfWidth / earthCircumference) * 360;
      const deltaLat = (halfHeight / earthCircumference) * 360;

      // Unrotated corners
      const unrotatedTopLeft = [-deltaLng, deltaLat];
      const unrotatedTopRight = [deltaLng, deltaLat];
      const unrotatedBottomRight = [deltaLng, -deltaLat];
      const unrotatedBottomLeft = [-deltaLng, -deltaLat];

      // Rotation function
      function rotatePoint(point, angleRad) {
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        return [
          point[0] * cos - point[1] * sin,
          point[0] * sin + point[1] * cos,
        ];
      }

      // Apply rotation
      const topLeft = rotatePoint(unrotatedTopLeft, angleRad);
      const topRight = rotatePoint(unrotatedTopRight, angleRad);
      const bottomRight = rotatePoint(unrotatedBottomRight, angleRad);
      const bottomLeft = rotatePoint(unrotatedBottomLeft, angleRad);

      // Translate back to the center location
      return [
        [center[0] + topLeft[0], center[1] + topLeft[1]],
        [center[0] + topRight[0], center[1] + topRight[1]],
        [center[0] + bottomRight[0], center[1] + bottomRight[1]],
        [center[0] + bottomLeft[0], center[1] + bottomLeft[1]],
      ];
    }

    map.on("load", function () {
      if (config.use3dTerrain) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });
      }

      // As the map moves, grab and update bounds in inset map.
      if (config.inset) {
        map.on("move", getInsetBounds);
      }

      const layers = map.getStyle().layers;
      // Find the index of the first symbol layer in the map style.
      let firstSymbolId;
      for (const layer of layers) {
        if (layer.type === "symbol") {
          firstSymbolId = layer.id;
          break;
        }
      }

      map.addSource("golden-triangle-zone", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { title: "golden triangle zone" },
              geometry: {
                type: "MultiPolygon",
                coordinates: [
                  [
                    [
                      [100.084324685, 20.356719159],
                      [100.085427073, 20.360966018],
                      [100.085778526, 20.361377067],
                      [100.088151359, 20.36018055],
                      [100.087950277, 20.359783164],
                      [100.089035231, 20.359318555],
                      [100.089145033, 20.359089897],
                      [100.088966164, 20.357896817],
                      [100.088758795, 20.357912072],
                      [100.088864324, 20.356765344],
                      [100.092196298, 20.356770456],
                      [100.093884664, 20.35652537],
                      [100.093937722, 20.356410454],
                      [100.099269451, 20.357287536],
                      [100.09909385, 20.358050122],
                      [100.099403645, 20.358102928],
                      [100.099426444, 20.358646075],
                      [100.100040669, 20.358441137],
                      [100.100790179, 20.359757599],
                      [100.101482021, 20.359677971],
                      [100.101940847, 20.360971969],
                      [100.103074918, 20.360541726],
                      [100.103845299, 20.361904959],
                      [100.104271435, 20.361709074],
                      [100.104435972, 20.361486283],
                      [100.105474657, 20.361060231],
                      [100.105587897, 20.360910781],
                      [100.104782983, 20.359272622],
                      [100.108642095, 20.358808349],
                      [100.112353098, 20.359348478],
                      [100.11346873, 20.359292152],
                      [100.113579958, 20.359625165],
                      [100.114438935, 20.359988437],
                      [100.117325663, 20.359393825],
                      [100.118579092, 20.360245091],
                      [100.119268839, 20.36034559],
                      [100.120823682, 20.359455096],
                      [100.121281083, 20.358514647],
                      [100.120733493, 20.357485936],
                      [100.121797492, 20.356599466],
                      [100.121987426, 20.355960429],
                      [100.122613973, 20.35610837],
                      [100.12436403, 20.354968431],
                      [100.125121754, 20.355350562],
                      [100.126353559, 20.354715633],
                      [100.129160658, 20.353726652],
                      [100.130434121, 20.352676232],
                      [100.132605956, 20.351179559],
                      [100.135007371, 20.348024779],
                      [100.138860867, 20.34603173],
                      [100.141350376, 20.34533863],
                      [100.141702081, 20.344516617],
                      [100.14334024, 20.342176222],
                      [100.145213512, 20.340984483],
                      [100.146639692, 20.340375957],
                      [100.148739275, 20.340875518],
                      [100.150953523, 20.342136156],
                      [100.15213864, 20.341655119],
                      [100.152858059, 20.341854022],
                      [100.154537541, 20.340744844],
                      [100.154895699, 20.341623771],
                      [100.155832796, 20.341158156],
                      [100.156288185, 20.343009718],
                      [100.157040377, 20.343171489],
                      [100.157631888, 20.343943043],
                      [100.158382739, 20.344409496],
                      [100.159181618, 20.343930219],
                      [100.159629463, 20.342775444],
                      [100.160757164, 20.341283298],
                      [100.161568868, 20.341744051],
                      [100.16228594, 20.34143786],
                      [100.162883653, 20.34189283],
                      [100.163248853, 20.341973883],
                      [100.164739574, 20.339345318],
                      [100.165572735, 20.337381522],
                      [100.165194544, 20.336850528],
                      [100.164364819, 20.336128595],
                      [100.162867057, 20.335275485],
                      [100.163183725, 20.334175863],
                      [100.163222534, 20.333555099],
                      [100.163102421, 20.332751526],
                      [100.1624229, 20.332521778],
                      [100.16235618, 20.332156998],
                      [100.162412842, 20.331342444],
                      [100.162824645, 20.329997149],
                      [100.162845432, 20.329605798],
                      [100.163566443, 20.328819156],
                      [100.163540878, 20.328028491],
                      [100.163708935, 20.327852723],
                      [100.163654118, 20.327475537],
                      [100.163828294, 20.32735685],
                      [100.164263147, 20.32737772],
                      [100.164062736, 20.32702392],
                      [100.164302039, 20.326466524],
                      [100.169873155, 20.335455863],
                      [100.170505737, 20.335433987],
                      [100.17048386, 20.335842185],
                      [100.170296357, 20.335871941],
                      [100.170277162, 20.336112334],
                      [100.171439648, 20.337983343],
                      [100.17448295, 20.336439228],
                      [100.171097583, 20.330230836],
                      [100.168181854, 20.325319544],
                      [100.167771141, 20.325235893],
                      [100.167628565, 20.325035398],
                      [100.167799975, 20.324656787],
                      [100.167733255, 20.324513624],
                      [100.165578854, 20.321134795],
                      [100.166665316, 20.320685777],
                      [100.166394162, 20.320376568],
                      [100.167276944, 20.319636949],
                      [100.166700269, 20.319380798],
                      [100.166374129, 20.319530583],
                      [100.165278866, 20.319007049],
                      [100.164421062, 20.317867194],
                      [100.163801891, 20.316674533],
                      [100.162740658, 20.315373326],
                      [100.162315528, 20.315641966],
                      [100.162161636, 20.315575498],
                      [100.161314729, 20.314050243],
                      [100.161002922, 20.313216998],
                      [100.16017194, 20.312198932],
                      [100.160100526, 20.311713787],
                      [100.159460232, 20.310186772],
                      [100.159218834, 20.309216651],
                      [100.158710723, 20.30919184],
                      [100.158055677, 20.310177133],
                      [100.157727861, 20.309777484],
                      [100.157911089, 20.309300721],
                      [100.15786918, 20.308961925],
                      [100.15764379, 20.30891398],
                      [100.157470788, 20.308586667],
                      [100.157188737, 20.308477367],
                      [100.156344092, 20.307691647],
                      [100.156184585, 20.30804352],
                      [100.155905467, 20.307795751],
                      [100.155064679, 20.306658326],
                      [100.155221253, 20.306466884],
                      [100.154926545, 20.305951229],
                      [100.15470652, 20.305870427],
                      [100.154488674, 20.305495253],
                      [100.154149375, 20.305770096],
                      [100.153897666, 20.305774958],
                      [100.153804376, 20.306075784],
                      [100.15384419, 20.306609795],
                      [100.154164881, 20.307030231],
                      [100.153887021, 20.307123941],
                      [100.153548392, 20.306869886],
                      [100.152512138, 20.308275866],
                      [100.152985045, 20.308657243],
                      [100.152078374, 20.308924542],
                      [100.151994388, 20.309482944],
                      [100.153346053, 20.310033048],
                      [100.153066433, 20.310706283],
                      [100.151900343, 20.310887499],
                      [100.150398473, 20.310860677],
                      [100.149811572, 20.311145494],
                      [100.147130788, 20.312010172],
                      [100.146764583, 20.312768398],
                      [100.14630844, 20.313090934],
                      [100.14631833, 20.314243362],
                      [100.146493344, 20.31467327],
                      [100.146280947, 20.315130838],
                      [100.147317118, 20.318378742],
                      [100.147711319, 20.318857097],
                      [100.149762454, 20.319567798],
                      [100.149204136, 20.321034045],
                      [100.147842579, 20.320996494],
                      [100.147622974, 20.321321628],
                      [100.144997342, 20.321832672],
                      [100.144328634, 20.322481935],
                      [100.144454782, 20.322938581],
                      [100.145003629, 20.323395059],
                      [100.144955852, 20.324036778],
                      [100.144280522, 20.32398196],
                      [100.143755396, 20.324542374],
                      [100.144046332, 20.326161087],
                      [100.142089995, 20.326591749],
                      [100.140427026, 20.329415361],
                      [100.14018043, 20.331193666],
                      [100.139877257, 20.332201338],
                      [100.138103143, 20.333943852],
                      [100.137147774, 20.334291785],
                      [100.136203888, 20.334931156],
                      [100.135921837, 20.335392748],
                      [100.136136833, 20.336129936],
                      [100.136122248, 20.336501338],
                      [100.135779931, 20.337276329],
                      [100.136248396, 20.337291249],
                      [100.136409663, 20.337632979],
                      [100.13574917, 20.338202697],
                      [100.134087625, 20.338887498],
                      [100.132837632, 20.339193941],
                      [100.13093846, 20.339378846],
                      [100.130131618, 20.339341295],
                      [100.129062255, 20.338398163],
                      [100.127944947, 20.337652593],
                      [100.126636281, 20.335943439],
                      [100.123790624, 20.333841677],
                      [100.123195174, 20.331763719],
                      [100.122975233, 20.331447554],
                      [100.122572734, 20.33128134],
                      [100.121851974, 20.331763551],
                      [100.121540838, 20.331724492],
                      [100.121681654, 20.331248483],
                      [100.122201332, 20.330826538],
                      [100.122384476, 20.330480282],
                      [100.122018355, 20.32961418],
                      [100.121939146, 20.32829973],
                      [100.121665561, 20.327735292],
                      [100.12107405, 20.327440249],
                      [100.120176264, 20.327290716],
                      [100.119186529, 20.328203673],
                      [100.118759471, 20.328171151],
                      [100.11844121, 20.327953892],
                      [100.11833015, 20.327589028],
                      [100.117951707, 20.327364561],
                      [100.117548537, 20.3266148],
                      [100.117484164, 20.326230657],
                      [100.117944834, 20.325659179],
                      [100.11757033, 20.325033051],
                      [100.116506164, 20.325805862],
                      [100.115670991, 20.325628417],
                      [100.115462785, 20.325734448],
                      [100.114473133, 20.325473771],
                      [100.114094439, 20.325572678],
                      [100.11249425, 20.325222063],
                      [100.112422417, 20.324879662],
                      [100.110592396, 20.324415472],
                      [100.11027556, 20.324397283],
                      [100.110315123, 20.324763153],
                      [100.109321783, 20.324795843],
                      [100.108548134, 20.324275159],
                      [100.108619547, 20.324101654],
                      [100.108538746, 20.323970728],
                      [100.10496093, 20.322815367],
                      [100.103533576, 20.321298997],
                      [100.103327633, 20.320718382],
                      [100.103300727, 20.320028049],
                      [100.103490074, 20.319549693],
                      [100.10331615, 20.318702786],
                      [100.102249888, 20.316700265],
                      [100.101663657, 20.316050668],
                      [100.097110272, 20.315443064],
                      [100.095656934, 20.320064929],
                      [100.093911989, 20.327047976],
                      [100.091721966, 20.331786937],
                      [100.091226931, 20.33400395],
                      [100.090316991, 20.33660695],
                      [100.088315979, 20.341393939],
                      [100.08749799, 20.343072918],
                      [100.086110952, 20.345182978],
                      [100.08465292, 20.35227499],
                      [100.084324685, 20.356719159],
                    ],
                  ],
                ],
              },
            },
          ],
        },
      });

      map.addSource("franks-journey", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [55.29, 25.26],
                  [102.61, 17.96],
                ],
              },
              properties: {
                title: "Dubai to Laos",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [55.29, 25.26],
              },
              properties: {
                title: "Dubai",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [102.61, 17.96],
              },
              properties: {
                title: "Laos",
              },
            },
          ],
        },
      });

      map.addSource("laos-to-golden", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                title: "Laos to Golden Triangle",
              },
              geometry: {
                coordinates: [
                  [102.6, 17.96],
                  [100.105, 20.34],
                ],
                type: "LineString",
              },
            },

            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [102.6, 17.96],
              },
              properties: {
                title: "Dubai",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [100.105, 20.34],
              },
              properties: {
                title: "Laos",
              },
            },
          ],
        },
      });

      map.addSource("golden-to-myanmar", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                title: "Laos to Golden Triangle",
              },
              geometry: {
                coordinates: [
                  [100.105, 20.34],
                  [99.89, 20.45],
                ],
                type: "LineString",
              },
            },

            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [100.105, 20.34],
              },
              properties: {
                title: "Dubai",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [99.89, 20.45],
              },
              properties: {
                title: "Laos",
              },
            },
          ],
        },
      });

      map.addSource("franks-journey-home", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [
                  [99.89, 20.45],
                  [102.61, 17.96],
                  [32.57, 0.31],
                ],
                type: "LineString",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [99.89, 20.45],
              },
              properties: {
                title: "Myanmar",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [102.61, 17.96],
              },
              properties: {
                title: "Myanmar",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [32.57, 0.31],
              },
              properties: { title: "Kampala" },
            },
          ],
        },
      });

      // Laos boundaries
      map.addLayer(
        {
          id: "laos-boundaries",
          source: {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
          },
          "source-layer": "country_boundaries",
          type: "fill",
          paint: {
            "fill-color": "#d8352a",
            "fill-opacity": 0,
          },
        },
        "country-label"
      );
      map.setFilter("laos-boundaries", ["in", "iso_3166_1_alpha_3", "LAO"]);

      // Myanmar boundaries
      map.addLayer(
        {
          id: "myanmar-boundaries",
          source: {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
          },
          "source-layer": "country_boundaries",
          type: "fill",
          paint: {
            "fill-color": "#d8352a",
            "fill-opacity": 0,
          },
        },
        "country-label"
      );
      map.setFilter("myanmar-boundaries", ["in", "iso_3166_1_alpha_3", "MMR"]);

      // Golden triangle zone boundaries
      map.addLayer(
        {
          id: "golden-triangle-zone",
          type: "fill",
          source: "golden-triangle-zone",
          paint: {
            "fill-color": "#feaa01",
            "fill-opacity": 0,
          },
        },
        // "country-label",
        firstSymbolId
      );

      // Dubai-Laos lines
      map.addLayer(
        {
          id: "Dubai-Laos-line",
          type: "line",
          source: "franks-journey",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#d8352a",
            "line-width": 3,
            "line-opacity": 0,
          },
        },
        "country-label"
      );
      // Dubai-Laos points.
      map.addLayer(
        {
          id: "Dubai-Laos-points",
          type: "circle",
          source: "franks-journey",
          paint: {
            "circle-radius": 10,
            "circle-opacity": 0,
            "circle-color": "#d8352a",
          },
        },
        firstSymbolId
      );

      // Laos-golden line
      map.addLayer(
        {
          id: "Laos-to-golden-line",
          type: "line",
          source: "laos-to-golden",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#d8352a",
            "line-width": 3,
            "line-opacity": 0,
          },
        },
        "country-label"
      );
      // Laos-golden points.
      map.addLayer(
        {
          id: "Laos-to-golden-points",
          type: "circle",
          source: "laos-to-golden",
          paint: {
            "circle-radius": 10,
            "circle-opacity": 0,
            "circle-color": "#d8352a",
          },
        },
        firstSymbolId
      );

      // Golden-to-myanmar line
      map.addLayer(
        {
          id: "Golden-to-myanmar-line",
          type: "line",
          source: "golden-to-myanmar",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#d8352a",
            "line-width": 3,
            "line-opacity": 0,
          },
        },
        "country-label"
      );
      // Golden-to-myanmar points.
      map.addLayer(
        {
          id: "Golden-to-myanmar-points",
          type: "circle",
          source: "golden-to-myanmar",
          paint: {
            "circle-radius": 10,
            "circle-opacity": 0,
            "circle-color": "#d8352a",
          },
        },
        firstSymbolId
      );

      // Myanmar-Uganda line.
      map.addLayer({
        id: "Myanmar-Uganda-line",
        type: "line",
        source: "franks-journey-home",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#d8352a",
          "line-width": 3,
          "line-opacity": 0,
        },
      });
      // Myanmar-Uganda points.
      map.addLayer(
        {
          id: "Myanmar-Uganda-points",
          type: "circle",
          source: "franks-journey-home",
          paint: {
            "circle-radius": 10,
            "circle-opacity": 0,
            "circle-color": "#d8352a",
          },
        },
        firstSymbolId
      );

      useGSAP(() => {});

      gsap.utils
        .toArray(`.${config.scrollSection} .map_step`)
        .forEach((step, index, steps) => {
          let nextStep = steps[index + 1]; // Get the next step

          ScrollTrigger.create({
            trigger: step,
            start: "top 90%",
            endTrigger: nextStep ? nextStep : step,
            end: nextStep ? "top 90%" : "bottom 90%",
            onToggle: (element) => {
              let mapLocation = mapLocations[index];

              function boundsOrCenter(mapInstance, location, inset) {
                if (location.centerLocation) {
                  mapInstance.flyTo({
                    ...location.centerLocation,
                    zoom: inset ? 3 : location.centerLocation.zoom,
                  });
                } else if (location.boundsLocation) {
                  mapInstance.fitBounds(location.boundsLocation.bounds, {
                    ...location.boundsLocation.fitBoundsOptions,
                    maxZoom: inset
                      ? 3
                      : location.boundsLocation.fitBoundsOptions.maxZoom,
                  });
                }
              }

              if (mapLocation) {
                if (element.isActive) {
                  // Uses the bounds or center to flyTo on the map
                  boundsOrCenter(map, mapLocation, false);

                  // if (config.inset) {
                  //   // Uses the bounds or center to flyTo on the inset map
                  //   boundsOrCenter(insetMap, mapLocation, true);
                  // }

                  if (mapLocation.onChapterEnter) {
                    mapLocation.onChapterEnter.forEach(setLayerOpacity);
                  }

                  if (mapLocation.callbackIn) {
                    mapLocation.callbackIn();
                  }

                  if (mapLocation.rotateAnimation) {
                    map.once("moveend", () => {
                      let rotateNumber = map.getBearing();

                      let rotationBearing =
                        mapLocation.rotationDirection === "CCW"
                          ? ((rotateNumber + 180) % 360) + 1
                          : ((rotateNumber + 180) % 360) - 1;

                      map.rotateTo(rotationBearing, {
                        duration: 200000,
                        easing: function (t) {
                          return Math.sin((t * Math.PI) / 2);
                        },
                      });
                    });
                  }
                } else {
                  if (mapLocation.onChapterExit) {
                    mapLocation.onChapterExit.forEach(setLayerOpacity);
                  }
                  if (mapLocation.callbackOut) {
                    mapLocation.callbackOut();
                  }
                }
              }
            },
          });
        });
    });

    //Helper functions for insetmap
    function getInsetBounds() {
      let bounds = map.getBounds();

      let boundsJson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [bounds._sw.lng, bounds._sw.lat],
                  [bounds._ne.lng, bounds._sw.lat],
                  [bounds._ne.lng, bounds._ne.lat],
                  [bounds._sw.lng, bounds._ne.lat],
                  [bounds._sw.lng, bounds._sw.lat],
                ],
              ],
            },
          },
        ],
      };

      // if (initLoad) {
      //   addInsetLayer(boundsJson);
      //   initLoad = false;
      // } else {
      //   updateInsetLayer(boundsJson);
      // }
    }
  }

  const map1Config = {
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
    use3dTerrain: false, //set true for enabling 3D maps.
    auto: false,
  };
  const map1Locations = [
    {
      mapAnimation: "flyTo",
      rotateAnimation: false,
      rotationDirection: "CW",
      callbackOut: "",
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
      callbackOut: "",
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
      callbackOut: "",
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
      callbackOut: "",
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
      callbackOut: "",
      centerLocation: {
        center: [100.105, 20.34],
        zoom: 13,
        pitch: 45,
        bearing: 60,
        speed: 0.4,
      },
      // boundsLocation: {
      //   bounds: [
      //     [106.064149, 10.995806],
      //     [106.244051, 11.143047],
      //   ],
      //   fitBoundsOptions: {
      //     maxZoom: 10,
      //     zoom: 10.33,
      //     pitch: 39.5,
      //     bearing: 0.0,
      //     speed: 0.4,
      //   },
      // },
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
      callbackIn: "",
      callbackOut: "",
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
      callbackIn: "",
      callbackOut: "",
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
      callbackIn: "",
      callbackOut: "",
      centerLocation: {
        center: [32.57, 0.31],
        zoom: 6,
        pitch: 0.0,
        bearing: 0.0,
        speed: 0.4,
      },
    },
  ];

  createMapboxMap(map1Config, map1Locations);

  return (
    <ScrollSection pinType="pin_block" className="my-12" id="georgeMap">
      <ScrollBackground>
        <div ref={mapContainerRef} id="map1"></div>
      </ScrollBackground>
      <ScrollForeground>
        <ScrollTextChapter className="mt-[20vh]" position="center">
          <p>
            Like many Africans, George hoped to change his fortunes in Dubai.
          </p>
        </ScrollTextChapter>
        <ScrollTextChapter step={true} position="center" className="">
          <p>
            {" "}
            But life there was difficult and after two years, he was still
            struggling to make ends meet.
          </p>
        </ScrollTextChapter>
        <ScrollTextChapter step={true} position="center" className="">
          <p>
            Then in August 2022, a friend sent him a well-paid IT job
            opportunity in Laos and he jumped at it. The job was a six-month
            contract offering US$1,500 per month, plus commissions and free
            accommodation. Everything seemed to check out.
          </p>
        </ScrollTextChapter>
        <ScrollTextChapter step={true} position="center" className="">
          <p>
            George was soon on his way to the Golden Triangle, a lawless area on
            Laos’ border with Myanmar and Thailand.
          </p>
        </ScrollTextChapter>
        <ScrollTextChapter step={true} position="center" className="">
          <p>
            Once there, he was asked to sign a contract completely different
            from what he had discussed in Dubai, which required him to pay a
            substantial amount of money.
          </p>
        </ScrollTextChapter>
        <ScrollTextChapter step={true} position="center" className="">
          <p>
            His passport and phone were taken away and he was introduced to his
            new job: scamming people into putting money into fake investments.
          </p>
        </ScrollTextChapter>
        <ScrollTextChapter step={true} position="center" className="">
          <p>
            For two months, Frank dragged his feet, insisting that he was simply
            an IT guy and he should do the work he was good at. Then, one day he
            was sold to a second scam company in Myanmar.
          </p>
        </ScrollTextChapter>
        <ScrollTextChapter step={true} position="center" className="">
          <div className="grid sm:grid-cols-2">
            <p className="map_step map_quote_block pointer-events-auto relative mx-auto w-auto rounded-sm bg-[rgba(0,0,0,0.6)] p-5 text-center text-xl italic sm:text-left">
              They don't tell you [how much they sell you for]. They just tell
              you: ‘We own you. We bought you.’ … <br />
              <br />
              It’s weird. It takes you back to the, the ages of the slave trade
              in Africa. It was hard to believe when someone tells you: ‘I own
              you.’
            </p>
            <div className="h-full overflow-hidden">
              <img
                className="h-[220%] rounded-r-sm object-cover object-[50%_0%] md:h-full md:w-full md:object-none"
                alt=""
                sizes="(max-width: 599px) 100vw, (min-width: 600px) 750px, 750px"
                srcSet="
                 https://images.theconversation.com/files/620360/original/file-20240919-16-1p4tw0.jpg?ixlib=rb-4.1.0&amp;q=45&amp;auto=format&amp;w=600&amp;fit=crop&amp;dpr=1  600w,
                 https://images.theconversation.com/files/620360/original/file-20240919-16-1p4tw0.jpg?ixlib=rb-4.1.0&amp;q=30&amp;auto=format&amp;w=600&amp;fit=crop&amp;dpr=2 1200w,
                 https://images.theconversation.com/files/620360/original/file-20240919-16-1p4tw0.jpg?ixlib=rb-4.1.0&amp;q=15&amp;auto=format&amp;w=600&amp;fit=crop&amp;dpr=3 1800w,
                 https://images.theconversation.com/files/620360/original/file-20240919-16-1p4tw0.jpg?ixlib=rb-4.1.0&amp;q=45&amp;auto=format&amp;w=754&amp;fit=crop&amp;dpr=1  754w,
                 https://images.theconversation.com/files/620360/original/file-20240919-16-1p4tw0.jpg?ixlib=rb-4.1.0&amp;q=30&amp;auto=format&amp;w=754&amp;fit=crop&amp;dpr=2 1508w,
                 https://images.theconversation.com/files/620360/original/file-20240919-16-1p4tw0.jpg?ixlib=rb-4.1.0&amp;q=15&amp;auto=format&amp;w=754&amp;fit=crop&amp;dpr=3 2262w
               "
                src="https://images.theconversation.com/files/620360/original/file-20240919-16-1p4tw0.jpg?ixlib=rb-4.1.0&amp;q=45&amp;auto=format&amp;w=754&amp;fit=clip"
              />
            </div>
          </div>
        </ScrollTextChapter>
        <ScrollTextChapter step={true} position="center" className="">
          <p>
            He was supposed to be gone only for six months — it would take him
            an entire year to find his way back to Kampala.
          </p>
        </ScrollTextChapter>
      </ScrollForeground>
    </ScrollSection>
  );
}