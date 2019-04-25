import Api from '../../api';
import { capitalizeFirstLetter } from '../../utils/strings';

import {
    LOADING,
    FAILED,
    CURRENT_USER_SUCCESS,
    GROUP_USERS_SUCCESS,
} from './types'

import { Dispatch } from 'redux';

export const loading = (bool: boolean) => ({
    type: LOADING,
    payload: bool,
})

export const failed = (error: any) => ({
    type: FAILED,
    payload: error
})

export const getCurrentUser = () => (
    (dispatch: Dispatch): Promise<void> => {
        dispatch(loading(true))

        return Api.instance.users.getCurrentUser()
            .then(res => {
                dispatch(currentUserSuccess(res.data))
                return res.data;
            }).catch(err => {
                console.log(err)
                dispatch(failed(err))
            })
    }
)

export const getGroupUsers = () => (
    (dispatch: Dispatch): Promise<void> => {
        dispatch(loading(true))

        return Api.instance.users.getGroupUsers()
            .then(res => {
                dispatch(groupUsersSuccess(res.data));
            }).catch(err => {
                dispatch(failed(err));
            })
    }
)

export const currentUserSuccess = (user: any) => ({
    type: CURRENT_USER_SUCCESS,
    payload: {
        ...user,
        fullName: `${capitalizeFirstLetter(user.firstname)} ${capitalizeFirstLetter(user.lastname)}`,
        group: user.groups[0]
    }
})

export const groupUsersSuccess = (users: any) => {
    const _users = users.map((user: any) => {
        return {
            ...user,
            fullName: `${capitalizeFirstLetter(user.firstname)} ${capitalizeFirstLetter(user.lastname)}`,
        }
    })

    return ({
        type: GROUP_USERS_SUCCESS,
        payload: _users
    })
}
