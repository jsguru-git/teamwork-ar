import TwilioChat from "../../twilio/chat";

export const TOGGLE_CHAT = 'TOGGLE_CHAT'
export const CHAT_CONNECTING = 'CHAT_CONNECTING'
export const CHAT_CONNECT_SUCCESS = 'CHAT_CONNECT_SUCCESS'
export const CHAT_CONNECT_FAILED = 'CHAT_CONNECT_FAILED'
export const CHAT_LOADING = 'CHAT_LOADING'
export const CHAT_LOADED = 'CHAT_LOADED'
export const CHAT_DISCONNECT = 'CHAT_DISCONNECT'
export const IS_TYPING = 'IS_TYPING'

export const CHAT_MESSAGE_ADD = 'CHAT_MESSAGE_ADD'

import { IMessage } from "../../containers/session/interface/chat/types";

export type ChatState = {
    isOpen: boolean,
    error: any,
    connecting: boolean,
    connected: boolean,
    loading: boolean,
    loaded: boolean,
    messages: (IMessage | string)[],
    isTyping: boolean,
    twilioChat?: TwilioChat | null
}