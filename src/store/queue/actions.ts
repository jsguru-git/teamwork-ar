import Api from '../../api'

import { 
    GETTING_USERS,
    GET_USERS_FAILED, 
    GET_USERS_SUCCESS, 
    QueueStateUser
} from './types'

import { Dispatch } from 'redux';

export const getUsers = () => (
    (dispatch: Dispatch) => (
        new Promise((resolve, reject) => {
            dispatch(gettingUsers())

            Api.instance.users.getGroupUsers()
            .then(res => {
                dispatch(getUsersSuccess(res.data))
                resolve(res.data);
            }).catch(error => {
                dispatch(getUsersFailed(error));
                reject(error);
            }) 
        })
    )
)

export const gettingUsers = () => ({
  type: GETTING_USERS
})

export const getUsersSuccess = (users: QueueStateUser[]) => ({
  type: GET_USERS_SUCCESS,
  payload: users
})

export const getUsersFailed = (error: any) => ({
  type: GET_USERS_FAILED,
  payload: error
})

