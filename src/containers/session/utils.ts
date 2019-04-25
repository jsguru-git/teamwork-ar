import { Cords } from "./video/types";

export const parseCords = (cords: any): Cords => {
    var _cords: Cords = {
        x: cords.x / cords.maxX,
        y: cords.y / cords.maxY
    };
    return _cords;
}