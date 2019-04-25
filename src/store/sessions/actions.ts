import Api from '../../api';

import {
    LOADING,
    FAILED,
    PENDING_SESSIONS_SUCCESS,
    COMPLETED_SESSIONS_SUCCESS,
    PendingSessionState,
    CompletedSessionState
} from './types'

import { Dispatch } from 'redux';

export const loading = () => ({
    type: LOADING
})

export const failed = (error: any) => ({
    type: FAILED,
    payload: error
})

export const getPendingSessions = () => (
    (dispatch: Dispatch) => {
        dispatch(loading())

        return Api.instance.sessions.getPendingSessions()
            .then((res) => {
                dispatch(pendingSessionsSuccess(res.data))
            }).catch(err => {
                dispatch(failed(err))
            })
    }
)

export const getCompletedSessions = () => (
    (dispatch: Dispatch) => {
        dispatch(loading())

        return Api.instance.sessions.getCompletedSessions()
            .then(res => {
                dispatch(completedSessionsSuccess(res.data))
            }).catch(err => {
                dispatch(failed(err))
            })
    }
)

export const pendingSessionsSuccess = (sessions: PendingSessionState[]) => ({
    type: PENDING_SESSIONS_SUCCESS,
    payload: sessions
})

export const completedSessionsSuccess = (sessions: CompletedSessionState[]) => ({
    type: COMPLETED_SESSIONS_SUCCESS,
    payload: sessions
})