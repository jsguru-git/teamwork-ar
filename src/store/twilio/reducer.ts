import {
    LOADING,
    FAILED,
    TOKEN_SUCCESS,
    TOKEN_RESET,
} from './types'

const initialState = {
    loading: false,
}

export default (state = initialState, { type, payload }: any) => {
  switch (type) {

    case TOKEN_SUCCESS:
    return { 
        ...state,
        token: payload.token,
        id: payload.id
    }

    case TOKEN_RESET: 
    return initialState;

    case FAILED:
    return { 
        ...state,
        error: payload
    }

    case LOADING:
    return { 
        ...state,
        loading: true,
    }

  default:
    return state
  }
}
