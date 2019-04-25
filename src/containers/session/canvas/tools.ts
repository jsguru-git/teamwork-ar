import { StyleSheet } from "react-native";

const eraser = require('../../../assets/drawing_tools/eraser.png')
const pencil = require('../../../assets/drawing_tools/pencil.png')
const marker_thin = require('../../../assets/drawing_tools/marker_thin.png')
const marker_thick = require('../../../assets/drawing_tools/marker_thick.png')

export enum Tools {
    eraser = 'eraser',
    pencil = 'pencil',
    marker_thin = 'marker_thin',
    marker_thick = 'marker_thick',
}

type Tool = {
    id: string,
    name: string,
    src: any,
    active: boolean,
    stroke: number,
}

const tools: Tool[] = [
    {
        id: 'eraser',
        name: 'Eraser',
        src: eraser,
        active: false,
        stroke: 15,
    },
    {
        id: 'pencil',
        name: 'Pencil',
        src: pencil,
        active: false,
        stroke: 2.5,
    },
    {
        id: 'marker_thin',
        name: 'Marker (Thin)',
        src: marker_thin,
        active: false,
        stroke: 12.5,
    },
    {
        id: 'marker_thick',
        name: 'Marker (Thick)',
        src: marker_thick,
        active: false,
        stroke: 20,
    }
]

export default tools;