import { AxiosInstance, AxiosPromise } from 'axios';

const sessions = (axios: AxiosInstance): Sessions => ({
    getSessionById(roomId) {
        return axios.get(`${axios.defaults.baseURL}/rooms/${roomId}`);
    },

    getPendingSessions() {
        return axios.get(`${axios.defaults.baseURL}/rooms`, {
            params: {
                status: 'in-progress'
            }
        });
    },

    getCompletedSessions() {
        return axios.get(`${axios.defaults.baseURL}/rooms`, {
            params: {
                status: 'completed'
            }
        });
    },

    getSessionParticipants(roomId) {
        return axios.get(`${axios.defaults.baseURL}/rooms/${roomId}/participants`);
    },
    
    requestExpert(userId) {
        return axios.get(`${axios.defaults.baseURL}/rooms/${userId}/request-expert`);
    },
    
    invite(roomId, userId) {
        return axios.get(`${axios.defaults.baseURL}/rooms/${roomId}/invite/${userId}`);
    },
})

export default sessions;

export type Sessions = {
    getSessionById(roomId: string): AxiosPromise;
    getPendingSessions(): AxiosPromise;
    getCompletedSessions(): AxiosPromise;
    getSessionParticipants(roomId: string): AxiosPromise;
    requestExpert(roomId: string): AxiosPromise;
    invite(roomId: string, userId: string): AxiosPromise;
}