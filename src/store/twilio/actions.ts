import Api from '../../api';

import {
    LOADING,
    FAILED,
    TOKEN_SUCCESS,
    TOKEN_RESET,
} from './types'

import { Dispatch } from 'redux';

export const loading = () => ({
    type: LOADING
})

export const failed = (error: any) => ({
    type: FAILED,
    payload: error
})

export const getToken = (identity: string) => (
    (dispatch: Dispatch): Promise<void> => {
        dispatch(loading());

        return Api.instance.twilio.token()
            .then(res => {
                dispatch(tokenSuccess(res.data.token, identity));
            }).catch(error => {
                dispatch(failed(error));
            })
    }
)

export const getJoinToken = (identity: string) => (
    (dispatch: Dispatch): Promise<void> => {
        dispatch(loading());

        return Api.instance.twilio.joinToken(identity)
            .then((res) => {
                dispatch(tokenSuccess(res.data.token, identity));
            }).catch(error => {
                dispatch(failed(error));
            })
    }
)

export const tokenSuccess = (token: string, id: string) => ({
    type: TOKEN_SUCCESS,
    payload: {
        token,
        id,
    }
})

export const tokenReset = () => ({
  type: TOKEN_RESET,
})
