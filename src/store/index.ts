import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import reducers from './reducers'

import { AuthState } from './auth/types';
import { UsersState } from './users/types';
import { SessionsState } from './sessions/types';
import { SessionState } from './session/types';
import { TwilioState } from './twilio/types';
import { ChatState } from './chat/types';

const store = createStore(
    reducers,
    //@ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(
        thunk,
    )
);

export type StoreState = {
    auth: AuthState,
    users: UsersState,
    sessions: SessionsState,
    session: SessionState,
    twilio: TwilioState,
    chat: ChatState
}

export default store;