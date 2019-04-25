import { PendingSessionState } from "./types";
import { fullNameFromUser } from "../../utils/strings";
import store from "..";

export const parseSessions = (sessions: any): PendingSessionState[] => {
    const users = store.getState().users.all;

    return sessions.map((session: any) => {
        const user = users.filter((user: any) => user._id === session.uniqueName);

        const _session: PendingSessionState = {
            id: session.uniqueName,
            fullName: fullNameFromUser(user.firstname, user.lastname),
            created: session.dateCreated
        }
    }) 
}