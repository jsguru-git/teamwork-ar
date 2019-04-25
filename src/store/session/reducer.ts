import { 
  TOOLBAR_SET_TOOL,
  SESSION_SET_COMMAND,
  GET_PARTICIPANTS,
  GET_PARTICIPANTS_SUCCESS,
  GET_PARTICIPANTS_FAILED,
  SESSION_SET_MEDIA,
  ADD_INVITE,
  REMOVE_INVITE,
  INVITE_USER_SUCCESS,
  INVITE_USER_FAILED,
  TOGGLE_MUTE,
  CANVAS_SET_COLOR,
  CANVAS_SET_IMAGE,
  CANVAS_SET_SCREENSHOT,
  CANVAS_SET_STROKE,
} from './types'

const initialState = {
    toolbar: {
      tool: undefined,
    },
    settings: {
      muted: false,
    },
    canvas: {
      color: '#33ccff',
      recentColors: ['#33ccff', '#006eff', '#ff0000', '#ffe900', '#16bc19'],
      stroke: 5,
    },
    invites: [],
    sentInvites: [],
    participants: [],
}

export default (state = initialState, { type, payload }: any) => {
  switch (type) {

    case GET_PARTICIPANTS_SUCCESS:
    return { 
        ...state, 
        participants: payload 
    }

    case GET_PARTICIPANTS_FAILED:
    return { 
        ...state, 
        error: payload 
    }

  case TOOLBAR_SET_TOOL:
    return { 
        ...state, 
        toolbar: {
          tool: payload
        } 
    }

    case SESSION_SET_MEDIA:
    return { 
        ...state, 
        media: payload
    }

    case SESSION_SET_COMMAND:
    return { 
        ...state, 
        command: payload
    }

  case ADD_INVITE: 
    return  {
      ...state,
      invites: [...state.invites, payload],
    }

  case REMOVE_INVITE: 
    return {
      ...state,
      invites: [...state.invites.filter(invite => invite !== payload)]
    }

  case INVITE_USER_SUCCESS: 
    return {
      ...state,
      sentInvites: [...state.sentInvites, payload]
    }

  case INVITE_USER_FAILED: 
    return {
      ...state,
      error: payload
    }

  case TOGGLE_MUTE:
    return {
      ...state,
      settings: {
        muted: payload
      }
    }

  case CANVAS_SET_COLOR: 
    var { recentColors } = state.canvas;

    if (recentColors.includes(payload)) {
      recentColors.splice(recentColors.indexOf(payload), 1);
    } 
    
    if (recentColors.length >= 5) {
      recentColors.pop(); 
    }

    return {
      ...state,
      canvas: {
        ...state.canvas,
        color: payload,
        recentColors: [payload, ...recentColors]
      }
    }

    case CANVAS_SET_STROKE: 
    return {
      ...state,
      canvas: {
        ...state.canvas,
        stroke: payload
      }
    }

    case CANVAS_SET_SCREENSHOT: 
    return {
      ...state,
      canvas: {
        ...state.canvas,
        screenshot: payload
      }
    }

    case CANVAS_SET_IMAGE: 
    return {
      ...state,
      canvas: {
        ...state.canvas,
        image: payload
      }
    }
    
  default:
    return {...state}
  }
}
