export const GETTING_USERS = 'GETTING_USERS'
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS'
export const GET_USERS_FAILED = 'GET_USERS_FAILED'

export type QueueState = {
    loading: boolean,
    error: Error | null,
    users: QueueStateUser[]
}

export type QueueStateUser = {
    id: string,
    fullName: string,
}