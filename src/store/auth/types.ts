export const LOGIN_LOADING = 'LOGIN_LOADING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const LOGOUT = 'LOGOUT'

export const REGISTERING = 'LOGGING_IN'
export const REGISTER_SUCCESS = 'LOGIN_SUCCESS'
export const REGISTER_FAILED = 'LOGIN_FAILED'

export type AuthState = {
    loading: boolean,
    auth: boolean,
    error: any,
    token: string,
}