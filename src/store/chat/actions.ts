import store from '../'
import TwilioChat from '../../twilio/chat'

import { 
    TOGGLE_CHAT,
    CHAT_CONNECTING,
    CHAT_CONNECT_SUCCESS,
    CHAT_CONNECT_FAILED,
    CHAT_LOADING,
    CHAT_LOADED,
    CHAT_DISCONNECT,
    CHAT_MESSAGE_ADD,
    IS_TYPING,
} from './types'

import { Dispatch } from 'redux';
import { IMessage } from '../../containers/session/interface/chat/types';

export const toggleChat = (bool?: boolean) => {
  if (bool) {
    return {
      type: TOGGLE_CHAT,
      payload: bool
    }
  }

  return { 
    type: TOGGLE_CHAT,
    payload: !store.getState().chat.isOpen
  }
}

export const chatConnect = (token: string, twilioId: string, identity: string) => (
    (dispatch: Dispatch) => {
        dispatch(chatConnecting());

        new TwilioChat(identity).connect(token, twilioId)
        .then((twilioChat) => {
            dispatch(chatConnectSuccess(twilioChat));
            dispatch(chatLoading(true));
        }).catch(error => {
            dispatch(chatConnectFailed(error));
        })
    }
)

export const chatConnecting = () => ({
  type: CHAT_CONNECTING,
})


export const chatConnectSuccess = (twilioChat: TwilioChat) => ({
  type: CHAT_CONNECT_SUCCESS,
  payload: twilioChat
})

export const chatConnectFailed = (error: any) => ({
  type: CHAT_CONNECT_FAILED,
  payload: error
})

export const chatLoading = (bool: Boolean) => ({
  type: CHAT_LOADING,
  payload: bool,
})

export const chatLoaded = () => ({
  type: CHAT_LOADED,
})

export const chatDisconnect = (twilioChat: TwilioChat) => (
  (dispatch: Dispatch) => {
    twilioChat.leaveCurrentChannel()
    .then(() => {
      dispatch({
        type: CHAT_DISCONNECT
      })
    })
  }
)

export const chatAddMessage = (message: IMessage | string) => ({
  type: CHAT_MESSAGE_ADD,
  payload: message
})

export const isTyping = (bool: boolean) => ({
  type: IS_TYPING,
  payload: bool
})



