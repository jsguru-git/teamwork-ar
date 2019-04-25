import Api from '../../api';

import {
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
} from './types'

import { RESET } from '../reducers'
 
import { Dispatch } from 'redux';

export const loading = (bool: Boolean) => ({
  type: LOGIN_LOADING,
  payload: bool
})

export const login = (email: string, password: string) => (
  (dispatch: Dispatch) => {
    dispatch(loading(true));

    Api.instance.auth.login(email, password)
      .then(res => {
        dispatch(loginSuccess(res.data.token))
      }).catch(error => {
        dispatch(loginFailed(error))
      })
  }
)

export const loginSuccess = (token: string) => ({
  type: LOGIN_SUCCESS,
  payload: token
})

export const loginFailed = (error: any) => ({
  type: LOGIN_FAILED,
  payload: error
})

export const logout = () => (
  (dispatch: Dispatch) => {
    Api.instance.notify.unregister();
    dispatch({
      type: RESET,
    });
  }
)
