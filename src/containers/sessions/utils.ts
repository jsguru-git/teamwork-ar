import { PendingSessionState } from "../../store/sessions/types";

export const parseSession = (session: any, users: any[]): PendingSessionState => {
    const user = users.filter(user => user._id === session.uniqueName)[0];

    const _session: PendingSessionState = {
        id: session.uniqueName,
        fullName: user.fullName,
        created: session.dateCreated
    }

    return _session
}