import {
    LOGIN_LOADING,
    LOGIN_SUCCESS,
    LOGIN_FAILED
  } from './types'
  
  const initialState = {
    loading: false,
    auth: false,
  }
  
  export default (state = initialState, { type, payload }: any) => {
    switch (type) {

      case LOGIN_LOADING: 
        return {
          ...state,
          loading: payload,
        }
  
      case LOGIN_SUCCESS:
        return { 
          ...state,
          token: payload,
        }
  
      case LOGIN_FAILED:
        return { 
          ...state, 
          error: payload,
          loading: false,
        }
  
      default:
        return {...state}
    }
  }
  