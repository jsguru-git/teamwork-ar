import { 
    LOADING,
    FAILED,
    PENDING_SESSIONS_SUCCESS,
    COMPLETED_SESSIONS_SUCCESS,
} from './types'

const initialState = {
    loading: false,
    error: null,
    pending: [],
    completed: []
}

export default (state = initialState, { type, payload }: any) => {
  switch (type) {

    case LOADING:
    return { 
        ...state,
        loading: true,
    }

    case FAILED:
    return { 
        ...state,
        error: payload
    }

    case PENDING_SESSIONS_SUCCESS:
    return { 
        ...state,
        pending: payload
    }

    case COMPLETED_SESSIONS_SUCCESS:
    return { 
        ...state,
        completed: payload
    }

  default:
    return state
  }
}
