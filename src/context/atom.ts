import { atom } from "jotai";

const headerHeight = atom<number>(window.innerHeight);

export { headerHeight };
