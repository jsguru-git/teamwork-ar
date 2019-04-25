import { combineReducers } from 'redux'

import auth from './auth/reducer'
import users from './users/reducer'
import session from './session/reducer'
import sessions from './sessions/reducer'
import twilio from './twilio/reducer'
import chat from './chat/reducer'

const appReducers = combineReducers({
    auth,
    users,
    session,
    sessions,
    twilio,
    chat,
})

export const RESET = 'RESET'
const rootReducer = (state: any, action: any) => {
    if (action.type === RESET) {
        state = undefined;
    }
    return appReducers(state, action);
}

export default rootReducer;