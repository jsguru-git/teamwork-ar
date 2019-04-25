import {
    TOGGLE_CHAT,
    CHAT_CONNECTING,
    CHAT_CONNECT_SUCCESS,
    CHAT_CONNECT_FAILED,
    CHAT_DISCONNECT,
    CHAT_MESSAGE_ADD,
    IS_TYPING,
    ChatState,
    CHAT_LOADING,
    CHAT_LOADED
} from './types'

const initialState: ChatState = {
    isOpen: false,
    error: null,
    connecting: false,
    connected: false,
    loading: false,
    loaded: false,
    messages: [],
    isTyping: false,
    twilioChat: null,
}

export default (state = initialState, { type, payload }: any) => {
    switch (type) {

        case TOGGLE_CHAT:
            return {
                ...state,
                isOpen: payload
            }

        case CHAT_CONNECTING:
            return {
                ...state,
                connecting: true,
            }

        case CHAT_CONNECT_SUCCESS:
            return {
                ...state,
                connected: true,
                twilioChat: payload,
                messages: [],
            }

        case CHAT_CONNECT_FAILED:
            return {
                ...state,
                error: payload
            }

        case CHAT_LOADING:
            return {
                ...state,
                loading: payload
            }

        case CHAT_LOADED:
            return {
                ...state,
                loading: false,
                loaded: true,
            }

        case CHAT_DISCONNECT:
            return {
                ...state,
                connected: false,
                twilioChat: null,
                messages: [],
            }

        case CHAT_MESSAGE_ADD:
            return {
                ...state,
                connected: true,
                messages: [...state.messages, payload],             
            }

        case IS_TYPING:
            return {
                ...state,
                isTyping: payload
            }

        default:
            return state
    }
}
