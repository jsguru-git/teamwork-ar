import { ImageURISource } from "react-native";

export const LOADING = 'LOADING'
export const FAILED = 'FAILED'

export const PENDING_SESSIONS_SUCCESS = 'PENDING_SESSIONS_SUCCESS'
export const COMPLETED_SESSIONS_SUCCESS = 'COMPLETED_SESSIONS_SUCCESS'

export type SessionsState = {
    loading: boolean,
    error: any,
    pending: PendingSessionState[],
    completed: CompletedSessionState[],
}

export type PendingSessionState = {
    id: string,
    avatar?: ImageURISource,
    fullName: string,
    created: string,
}

export type CompletedSessionState = {
    id: string,
    avatar?: ImageURISource,
    fullName: string,
    created: string,
    ended: string,
}