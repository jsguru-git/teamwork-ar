import {
    GETTING_USERS,
    GET_USERS_FAILED,
    GET_USERS_SUCCESS,
} from './types'

const initialState = {
    users: [],
    loading: true,
    error: null,
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

        case GETTING_USERS:
            return {
                ...state,
                loading: true,
            }

        case GET_USERS_SUCCESS:
            return {
                ...state,
                users: payload,
                loading: false,
            }

        case GET_USERS_FAILED:
            return {
                ...state,
                loading: false,
                error: payload,
            }

        default:
            return state
    }
}
