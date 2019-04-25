import Api from "../../api";
import { parseParticipants } from "../utils";

import { 
    TOOLBAR_SET_TOOL,
    SESSION_SET_COMMAND,
    GET_PARTICIPANTS,
    GET_PARTICIPANTS_SUCCESS,
    GET_PARTICIPANTS_FAILED,
    INVITE_USER_SUCCESS,
    INVITE_USER_FAILED,
    TOGGLE_MUTE,   
    ADD_INVITE,
    REMOVE_INVITE,
    CANVAS_SET_IMAGE,
    CANVAS_SET_SCREENSHOT,
    CANVAS_SET_STROKE,
    CANVAS_SET_COLOR,
    Command,
    ParticipantState,
    SESSION_SET_MEDIA,
} from './types'

import { Dispatch } from "react";
import { MediaSession } from "../../containers/session/interface/chat/utils/media";

export const getParticipants = (participantIds: string[]) => (
  (dispatch: Dispatch<any>) => {   
      const participants: any[] = participantIds.map(participantId => {
        return Api.instance.users.getUserById(participantId)
          .then((user) => {
            return parseParticipants(user);
          }).catch((error) => {
            dispatch(getParticipantsFailed(error))
          })
      })
      dispatch(getParticipantsSuccess(participants));
  }
)

export const getParticipantsSuccess = (participants: ParticipantState[]) => ({
  type: GET_PARTICIPANTS_SUCCESS,
  payload: participants
})

export const getParticipantsFailed = (error: any) => ({
  type: GET_PARTICIPANTS_FAILED,
  payload: error,
})

export const toolbarSetTool = (name: string | undefined) => ({
  type: TOOLBAR_SET_TOOL,
  payload: name
})

export const sessionSetMedia = (mediaSession: MediaSession) => ({
  type: SESSION_SET_MEDIA,
  payload: mediaSession
})


export const sessionSetCommand = (command: Command | undefined) => ({
  type: SESSION_SET_COMMAND,
  payload: command
})


export const addInvite = (id: string) => ({
  type: ADD_INVITE,
  payload: id,
})

export const removeInvite = (id: string) => ({
  type: REMOVE_INVITE,
  payload: id
})

export const inviteUserSuccess = (id: string) => ({
  type: INVITE_USER_SUCCESS,
  payload: id
})

export const inviteUserFailed = (id: string) => ({
  type: INVITE_USER_FAILED,
  payload: id
})

export const toggleMute = (bool: boolean) => ({
  type: TOGGLE_MUTE,
  payload: bool,
})

export const canvasSetColor = (color: string) => ({
  type: CANVAS_SET_COLOR,
  payload: color
})

export const canvasSetStroke = (stroke: number) => ({
  type: CANVAS_SET_STROKE,
  payload: stroke
})

export const canvasSetScreenshot = (screenshot: string | undefined) => ({
  type: CANVAS_SET_SCREENSHOT,
  payload: screenshot
})

export const canvasSetImage = (image: string | undefined) => ({
  type: CANVAS_SET_IMAGE,
  payload: image
})

