
const cancel = require('../../../../../assets/toolbar_icons/cancel.png')
const cancel_tap  = require( '../../../../../assets/toolbar_icons/cancel-tap.png')

const confirm = require( '../../../../../assets/toolbar_icons/confirm.png')
const confirm_tap = require( '../../../../../assets/toolbar_icons/confirm-tap.png')

const move = require( '../../../../../assets/toolbar_icons/move.png')
const move_tap = require( '../../../../../assets/toolbar_icons/move-tap.png')

const settings = require( '../../../../../assets/toolbar_icons/settings.png')
const settings_tap = require( '../../../../../assets/toolbar_icons/settings-tap.png')

export type Action = {
    name: string,
    icon: any,
    icon_tap: any,
    toggle: boolean,
}

const actions = {
    cancel: {
        name: 'cancel',
        icon: cancel,
        icon_tap: cancel_tap,
        toggle: false,
    },
    confirm: {
        name: 'confirm',
        icon: confirm,
        icon_tap: confirm_tap,
        toggle: false,
    },
    move: {
        name: 'move',
        icon: move,
        icon_tap: move_tap,
        toggle: false,
    },
    settings: {
        name: 'settings',
        icon: settings,
        icon_tap: settings_tap,
        toggle: false,
    }
}

export default actions;