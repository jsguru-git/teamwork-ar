import {
  LOADING,
  FAILED,
  CURRENT_USER_SUCCESS,
  GROUP_USERS_SUCCESS,
} from './types'

const initialState = {
  loading: false,
}

export default (state = initialState, { type, payload }: any) => {
  switch (type) {

    case LOADING:
      return {
        ...state,
        loading: payload
      }

    case FAILED:
      return {
        ...state,
        error: payload
      }

    case CURRENT_USER_SUCCESS:
      return {
        ...state,
        current: payload,
      }

    case GROUP_USERS_SUCCESS:
      return {
        ...state,
        groupUsers: payload,
    }

    default:
      return state
  }
}
