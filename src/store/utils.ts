import { capitalizeFirstLetter } from '../utils/strings';
import { ParticipantState } from './session/types';

export const parseParticipants = (user: any): ParticipantState => {
    return {
        id: user._id,
        fullName: `${capitalizeFirstLetter(user.firstname)} ${capitalizeFirstLetter(user.lastname)}`,
        role: user.role,
    }
}