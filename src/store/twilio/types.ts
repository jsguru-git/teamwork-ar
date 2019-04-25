export const LOADING = 'LOADING'
export const FAILED = 'FAILED'
export const TOKEN_SUCCESS = 'TOKEN_SUCCESS'
export const TOKEN_RESET = 'TOKEN_RESET'

export type TwilioState = {
    loading: boolean,
    error: any,
    token: string,
    id: String
}