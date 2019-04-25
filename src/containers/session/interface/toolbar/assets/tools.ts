const chat = require( '../../../../../assets/toolbar_icons/chat.png')
const chat_tap = require( '../../../../../assets/toolbar_icons/chat-tap.png')

const arrow = require( '../../../../../assets/toolbar_icons/arrow.png')
const arrow_tap = require( '../../../../../assets/toolbar_icons/arrow-tap.png')

const circle = require( '../../../../../assets/toolbar_icons/circle.png')
const circle_tap = require( '../../../../../assets/toolbar_icons/circle-tap.png')

const camera = require( '../../../../../assets/toolbar_icons/camera.png')
const camera_tap = require( '../../../../../assets/toolbar_icons/camera-tap.png')

const pencil = require( '../../../../../assets/toolbar_icons/pencil.png')
const pencil_tap = require( '../../../../../assets/toolbar_icons/pencil-tap.png')

const undo = require( '../../../../../assets/toolbar_icons/undo.png')
const undo_tap = require( '../../../../../assets/toolbar_icons/undo-tap.png')

const redo = require( '../../../../../assets/toolbar_icons/redo.png')
const redo_tap = require( '../../../../../assets/toolbar_icons/redo-tap.png')

const tools = [
    {
        name: 'chat',
        icon: chat,
        icon_tap: chat_tap,
    },
    // {
    //     name: 'pencil',
    //     icon: pencil,
    //     icon_tap: pencil_tap,
    // },
    {
        name: 'arrow',
        icon: arrow,
        icon_tap: arrow_tap,
        toggle: true,
    },
    {
        name: 'circle',
        icon: circle,
        icon_tap: circle_tap,
        toggle: true,
    },
    {
        name: 'undo',
        icon: undo,
        icon_tap: undo_tap
    },
    {
        name: 'redo',
        icon: redo,
        icon_tap: redo_tap
    },
    {
        name: 'camera',
        icon: camera,
        icon_tap: camera_tap,
    },
]

export default tools;