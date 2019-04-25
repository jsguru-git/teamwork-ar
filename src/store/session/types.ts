import { MediaSession } from "../../containers/session/interface/chat/utils/media";

//Session
export interface SessionState {
    error?: any,
    command?: Command,
    toolbar: ToolbarState,
    settings: SettingsState,
    canvas: CanvasState,
    invites: string[],
    sentInvites: string[],
    participants: ParticipantState[],
    media: MediaSession,
}

export const SESSION_SET_MEDIA = 'SESSION_SET_MEDIA'

export const SESSION_SET_COMMAND = 'SESSION_SET_COMMAND'
export type Command = {
    obj: string,
    x: number,
    y: number,
} | string;

//Toolbar
export const TOOLBAR_SET_TOOL = 'TOOLBAR_SET_TOOL'

export type ToolbarState = {
    tool?: string,
}

//Invites
export const ADD_INVITE = 'ADD_INVITE'
export const REMOVE_INVITE = 'REMOVE_INVITE'
export const INVITE_USER_SUCCESS = 'INVITE_USER_SUCCESS'
export const INVITE_USER_FAILED = 'INVITE_USER_FAILED'

//Participants
export const GET_PARTICIPANTS = 'GET_PARTICIPANTS'
export const GET_PARTICIPANTS_SUCCESS = 'GET_PARTICIPANTS_SUCCESS'
export const GET_PARTICIPANTS_FAILED = 'GET_PARTICIPANTS_FAILED'

export type ParticipantState = {
    id: string,
    fullName: string,
    role: string,
}

//Settings
export const TOGGLE_MUTE = 'TOGGLE_MUTE'

export type SettingsState = {
    muted: boolean
}

//Canvas
export const CANVAS_SET_COLOR = 'CANVAS_SET_COLOR'
export const CANVAS_SET_STROKE = 'CANVAS_SET_STROKE'
export const CANVAS_SET_SCREENSHOT = 'CANVAS_SET_SCREENSHOT'
export const CANVAS_SET_IMAGE = 'CANVAS_SET_IMAGE'

export type CanvasState = {
    color: string,
    stroke: number,
    screenshot?: string,
    image?: string,
}