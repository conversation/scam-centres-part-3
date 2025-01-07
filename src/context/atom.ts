import { atom } from "jotai";
import { Map } from "mapbox-gl";

const headerHeight = atom<number>(window.innerHeight);
const mapInstance = atom<Map | null>(null);

export { headerHeight, mapInstance };
