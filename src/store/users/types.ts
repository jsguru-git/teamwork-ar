export const LOADING = 'LOADING'
export const FAILED = 'FAILED'

export const CURRENT_USER_SUCCESS = 'CURRENT_USER_SUCCESS'
export const GROUP_USERS_SUCCESS = 'GROUP_USERS_SUCCESS'

export type UsersState = {
    loading: boolean,
    error?: any,
    current?: CurrentUserState,
    groupUsers?: any[],
}

export type CurrentUserState = {
    _id: string,
    firstname: string,
    lastname: string,
    fullName: string,
    first_login: boolean,
    last_login: string,
    sms: boolean,
    role: string,
    verified: boolean,
    email: string,
    group: string,
}

export type GroupUserType = {
    id: string,
    firstname: string,
    lastname: string,
    role: 'fieldtech' | 'expert',
}